#!/usr/bin/env python3
from __future__ import annotations

import html
import posixpath
import sys
import zipfile
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def esc(text: str) -> str:
    return html.escape(text, quote=False)


class SimpleDocParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.blocks: list[tuple[str, object]] = []
        self.skip_depth = 0
        self.current: tuple[str, list[str]] | None = None
        self.list_stack: list[dict[str, int | str]] = []
        self.table: list[list[str]] | None = None
        self.row: list[str] | None = None
        self.cell: list[str] | None = None

    def handle_starttag(self, tag: str, attrs):
        tag = tag.lower()
        if tag in {"head", "style", "script", "title"}:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag in {"h1", "h2", "h3", "h4", "p", "pre"}:
            self.current = (tag, [])
        elif tag == "ul":
            self.list_stack.append({"type": "ul", "count": 0})
        elif tag == "ol":
            self.list_stack.append({"type": "ol", "count": 0})
        elif tag == "li":
            self.current = ("li", [])
        elif tag == "table":
            self.table = []
        elif tag == "tr":
            self.row = []
        elif tag in {"td", "th"}:
            self.cell = []
        elif tag == "br":
            if self.cell is not None:
                self.cell.append("\n")
            elif self.current is not None:
                self.current[1].append("\n")

    def handle_endtag(self, tag: str):
        tag = tag.lower()
        if tag in {"head", "style", "script", "title"} and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if tag in {"h1", "h2", "h3", "h4", "p", "pre"} and self.current:
            kind, parts = self.current
            text = "".join(parts).strip()
            if text:
                self.blocks.append((kind, text))
            self.current = None
        elif tag == "li" and self.current:
            _, parts = self.current
            text = " ".join("".join(parts).split())
            if text:
                prefix = "•"
                if self.list_stack and self.list_stack[-1]["type"] == "ol":
                    self.list_stack[-1]["count"] = int(self.list_stack[-1]["count"]) + 1
                    prefix = f"{self.list_stack[-1]['count']}."
                self.blocks.append(("li", f"{prefix} {text}"))
            self.current = None
        elif tag in {"ul", "ol"} and self.list_stack:
            self.list_stack.pop()
        elif tag in {"td", "th"} and self.cell is not None and self.row is not None:
            text = " ".join("".join(self.cell).split())
            self.row.append(text)
            self.cell = None
        elif tag == "tr" and self.row is not None and self.table is not None:
            if self.row:
                self.table.append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            self.blocks.append(("table", self.table))
            self.table = None

    def handle_data(self, data: str):
        if self.skip_depth:
            return
        if self.cell is not None:
            self.cell.append(data)
        elif self.current is not None:
            self.current[1].append(data)


def run(text: str, bold: bool = False, italic: bool = False, font: str | None = None, size: int | None = None) -> str:
    props: list[str] = []
    if bold:
        props.append("<w:b/>")
    if italic:
        props.append("<w:i/>")
    if font:
        props.append(f'<w:rFonts w:ascii="{font}" w:hAnsi="{font}" w:eastAsia="{font}" w:cs="{font}"/>')
    if size:
        props.append(f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>')
    rpr = f"<w:rPr>{''.join(props)}</w:rPr>" if props else ""
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'


def paragraph(
    text: str,
    *,
    style: str = "Normal",
    align: str | None = None,
    indent_left: int | None = None,
    space_after: int = 120,
    bold: bool = False,
    italic: bool = False,
    font: str | None = None,
    size: int | None = None,
    shading: str | None = None,
) -> str:
    ppr = [f'<w:pStyle w:val="{style}"/>']
    if align:
        ppr.append(f'<w:jc w:val="{align}"/>')
    if indent_left:
        ppr.append(f'<w:ind w:left="{indent_left}"/>')
    ppr.append(f'<w:spacing w:after="{space_after}" w:line="360" w:lineRule="auto"/>')
    if shading:
        ppr.append(f'<w:shd w:val="clear" w:color="auto" w:fill="{shading}"/>')
    pieces = []
    lines = text.splitlines() or [""]
    for i, line in enumerate(lines):
        if i:
            pieces.append("<w:r><w:br/></w:r>")
        pieces.append(run(line, bold=bold, italic=italic, font=font, size=size))
    return f"<w:p><w:pPr>{''.join(ppr)}</w:pPr>{''.join(pieces)}</w:p>"


def table_xml(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    max_cols = max(len(r) for r in rows)
    widths_by_5 = [620, 1760, 2580, 2580, 2780]
    if max_cols == 5:
        widths = widths_by_5
    else:
        widths = [int(10320 / max_cols)] * max_cols
    grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in widths)
    xml = [
        "<w:tbl>",
        "<w:tblPr>",
        '<w:tblW w:w="10320" w:type="dxa"/>',
        '<w:tblLayout w:type="fixed"/>',
        '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>',
        "<w:tblBorders>",
        '<w:top w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        '<w:left w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        '<w:right w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        '<w:insideH w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        '<w:insideV w:val="single" w:sz="6" w:space="0" w:color="9CA3AF"/>',
        "</w:tblBorders>",
        "</w:tblPr>",
        f"<w:tblGrid>{grid}</w:tblGrid>",
    ]
    for r_idx, row in enumerate(rows):
        xml.append("<w:tr>")
        if r_idx == 0:
            xml.append("<w:trPr><w:tblHeader/></w:trPr>")
        for c_idx in range(max_cols):
            text = row[c_idx] if c_idx < len(row) else ""
            shade = '<w:shd w:val="clear" w:color="auto" w:fill="E5E7EB"/>' if r_idx == 0 else ""
            align = "center" if r_idx == 0 or c_idx == 0 else "left"
            bold = r_idx == 0
            xml.append("<w:tc>")
            xml.append(f'<w:tcPr><w:tcW w:w="{widths[c_idx]}" w:type="dxa"/><w:vAlign w:val="center"/>{shade}<w:tcMar><w:top w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>')
            xml.append(paragraph(text, style="TableText", align=align, space_after=0, bold=bold, size=18))
            xml.append("</w:tc>")
        xml.append("</w:tr>")
    xml.append("</w:tbl>")
    return "".join(xml)


def image_paragraph(image: dict[str, object]) -> str:
    rid = image["rid"]
    name = esc(str(image["name"]))
    cx = int(image["cx"])
    cy = int(image["cy"])
    doc_id = int(image["doc_id"])
    return f'''<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:after="180"/></w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="{cx}" cy="{cy}"/>
            <wp:effectExtent l="0" t="0" r="0" b="0"/>
            <wp:docPr id="{doc_id}" name="{name}"/>
            <wp:cNvGraphicFramePr>
              <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
            </wp:cNvGraphicFramePr>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:nvPicPr>
                    <pic:cNvPr id="{doc_id}" name="{name}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="{rid}"/>
                    <a:stretch><a:fillRect/></a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>
                    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>'''


def build_document(blocks: list[tuple[str, object]]) -> str:
    body: list[str] = []
    for kind, value in blocks:
        if kind == "h1":
            body.append(paragraph(str(value), style="Title", align="center", bold=True, size=32, space_after=300))
        elif kind == "h2":
            body.append(paragraph(str(value), style="Heading1", bold=True, size=28, space_after=160))
        elif kind == "h3":
            body.append(paragraph(str(value), style="Heading2", bold=True, size=26, space_after=120))
        elif kind == "h4":
            body.append(paragraph(str(value), style="Heading3", bold=True, italic=True, size=24, space_after=80))
        elif kind == "pre":
            body.append(paragraph(str(value), style="Code", font="Consolas", size=20, shading="F8FAFC", space_after=140))
        elif kind == "li":
            body.append(paragraph(str(value), indent_left=420, space_after=60))
        elif kind == "image":
            body.append(image_paragraph(value))  # type: ignore[arg-type]
        elif kind == "table":
            rows = value  # type: ignore[assignment]
            if isinstance(rows, list) and len(rows) > 12:
                header = rows[0]
                for start in range(1, len(rows), 8):
                    body.append(table_xml([header] + rows[start:start + 8]))
                    body.append(paragraph("", space_after=120))
            else:
                body.append(table_xml(value))  # type: ignore[arg-type]
                body.append(paragraph("", space_after=120))
        else:
            body.append(paragraph(str(value), align="both", space_after=120))
    sect = """
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1304" w:right="1247" w:bottom="1304" w:left="1247" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
    """
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{NS['w']}" xmlns:r="{NS['r']}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>{''.join(body)}{sect}</w:body>
</w:document>'''


STYLES = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="{NS['w']}">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:jc w:val="center"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:b/><w:i/><w:sz w:val="24"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="20"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:rPr><w:sz w:val="20"/></w:rPr></w:style>
</w:styles>'''


CONTENT_TYPES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>'''


RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''


def doc_rels(image_count: int) -> str:
    image_rels = []
    for i in range(image_count):
        rid = f"rId{3 + i}"
        image_rels.append(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/table_{i + 1}.png"/>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>'''.replace("</Relationships>", "".join(image_rels) + "</Relationships>")


SETTINGS = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="{NS['w']}"><w:defaultTabStop w:val="720"/></w:settings>'''


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_table_image(rows: list[list[str]]) -> bytes:
    width = 1800
    margin = 36
    col_widths = [110, 300, 430, 430, 458]
    body_font = load_font(34)
    header_font = load_font(35, bold=True)
    line_body = 43
    line_header = 45
    padding_x = 15
    padding_y = 14

    scratch = Image.new("RGB", (width, 100), "white")
    draw = ImageDraw.Draw(scratch)
    row_heights: list[int] = []
    wrapped_rows: list[list[list[str]]] = []
    for r_idx, row in enumerate(rows):
        font = header_font if r_idx == 0 else body_font
        line_h = line_header if r_idx == 0 else line_body
        wrapped_cells = []
        max_lines = 1
        for c_idx, cell in enumerate(row[:5]):
            lines = wrap_text(draw, cell, font, col_widths[c_idx] - padding_x * 2)
            wrapped_cells.append(lines)
            max_lines = max(max_lines, len(lines))
        while len(wrapped_cells) < 5:
            wrapped_cells.append([""])
        wrapped_rows.append(wrapped_cells)
        row_heights.append(max(70, max_lines * line_h + padding_y * 2))

    height = margin * 2 + sum(row_heights)
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)
    x_positions = [margin]
    for w in col_widths[:-1]:
        x_positions.append(x_positions[-1] + w)
    y = margin
    for r_idx, cells in enumerate(wrapped_rows):
        row_h = row_heights[r_idx]
        fill = "#E5E7EB" if r_idx == 0 else "#FFFFFF"
        font = header_font if r_idx == 0 else body_font
        line_h = line_header if r_idx == 0 else line_body
        for c_idx, lines in enumerate(cells):
            x = x_positions[c_idx]
            col_w = col_widths[c_idx]
            draw.rectangle([x, y, x + col_w, y + row_h], fill=fill, outline="#9CA3AF", width=2)
            text_h = len(lines) * line_h
            ty = y + max(padding_y, (row_h - text_h) // 2)
            for line in lines:
                if r_idx == 0 or c_idx == 0:
                    bbox = draw.textbbox((0, 0), line, font=font)
                    tx = x + (col_w - (bbox[2] - bbox[0])) // 2
                else:
                    tx = x + padding_x
                draw.text((tx, ty), line, font=font, fill="#111827")
                ty += line_h
        y += row_h
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def preprocess_blocks(blocks: list[tuple[str, object]]) -> tuple[list[tuple[str, object]], list[bytes]]:
    result: list[tuple[str, object]] = []
    images: list[bytes] = []
    doc_id = 1
    for kind, value in blocks:
        if kind == "table" and isinstance(value, list) and value:
            header = value[0]
            for start in range(1, len(value), 6):
                chunk = [header] + value[start:start + 6]
                images.append(draw_table_image(chunk))
                idx = len(images)
                image_width_px = 1800
                image_height_px = Image.open(BytesIO(images[-1])).height
                width_emu = int(6.45 * 914400)
                height_emu = int((image_height_px / image_width_px) * width_emu)
                result.append(("image", {
                    "rid": f"rId{2 + idx}",
                    "name": f"Bảng kiểm thử {idx}",
                    "cx": width_emu,
                    "cy": height_emu,
                    "doc_id": doc_id,
                }))
                doc_id += 1
        else:
            result.append((kind, value))
    return result, images


def write_docx(html_path: Path, output_path: Path) -> None:
    parser = SimpleDocParser()
    parser.feed(html_path.read_text(encoding="utf-8"))
    blocks, images = preprocess_blocks(parser.blocks)
    document = build_document(blocks)
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS)
        z.writestr("word/document.xml", document)
        z.writestr("word/styles.xml", STYLES)
        z.writestr("word/settings.xml", SETTINGS)
        z.writestr("word/_rels/document.xml.rels", doc_rels(len(images)))
        for i, image_bytes in enumerate(images, start=1):
            z.writestr(f"word/media/table_{i}.png", image_bytes)


def main() -> int:
    if len(sys.argv) != 3:
        print(f"Usage: {posixpath.basename(sys.argv[0])} input.html output.docx", file=sys.stderr)
        return 2
    write_docx(Path(sys.argv[1]), Path(sys.argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
