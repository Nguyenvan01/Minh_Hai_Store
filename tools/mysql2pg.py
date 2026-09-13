#!/usr/bin/env python3
# Chuyen DDL MySQL sang PostgreSQL cho du an CLOTH Store.
import re, sys

src = open(sys.argv[1], encoding='utf-8').read()

# 1) Bo CREATE DATABASE / USE
src = re.sub(r'(?im)^\s*(CREATE DATABASE|USE)\b[^;]*;\s*\n?', '', src)

out, idx, table = [], [], None
for line in src.splitlines():
    m = re.match(r'\s*CREATE TABLE(?: IF NOT EXISTS)? (\w+)', line, re.I)
    if m:
        table = m.group(1)

    # 2) INDEX / KEY trong bang  ->  CREATE INDEX rieng
    mi = re.match(r'\s*(UNIQUE\s+)?(?:INDEX|KEY)\s+(\w+)\s*\(([^)]*)\)\s*,?\s*$', line, re.I)
    if mi and table:
        uq = 'UNIQUE ' if mi.group(1) else ''
        idx.append(f'CREATE {uq}INDEX IF NOT EXISTS {mi.group(2)} ON {table} ({mi.group(3)});')
        continue

    # 3) FULLTEXT: bo han
    if re.match(r'\s*FULLTEXT\b', line, re.I):
        continue

    # 4) UNIQUE KEY ten (cot)  ->  CONSTRAINT ten UNIQUE (cot)
    line = re.sub(r'(?i)^(\s*)UNIQUE KEY\s+(\w+)\s*\(', r'\1CONSTRAINT \2 UNIQUE (', line)

    # 5) ENUM -> VARCHAR + CHECK
    me = re.match(r'(\s*)(\w+)\s+ENUM\(([^)]*)\)(.*)$', line, re.I)
    if me:
        ind, col, vals, rest = me.groups()
        rest = rest.rstrip()
        comma = ',' if rest.endswith(',') else ''
        rest = rest.rstrip(',')
        line = f'{ind}{col} VARCHAR(30){rest} CHECK ({col} IN ({vals})){comma}'

    # 6) Kieu du lieu
    line = re.sub(r'(?i)\bINT\s+AUTO_INCREMENT\b', 'SERIAL', line)
    line = re.sub(r'(?i)\bBIGINT\s+AUTO_INCREMENT\b', 'BIGSERIAL', line)
    is_boolean_column = bool(re.search(r'(?i)(?:\bTINYINT\s*\(\s*1\s*\)|\bBOOLEAN\b)', line))
    line = re.sub(r'(?i)\bTINYINT\s*\(\s*1\s*\)', 'BOOLEAN', line)
    if is_boolean_column:
        line = re.sub(r'(?i)\bDEFAULT\s+0\b', 'DEFAULT FALSE', line)
        line = re.sub(r'(?i)\bDEFAULT\s+1\b', 'DEFAULT TRUE', line)
    line = re.sub(r'(?i)\bTINYINT\b', 'SMALLINT', line)
    line = re.sub(r'(?i)\bDATETIME\b', 'TIMESTAMPTZ', line)
    line = re.sub(r'(?i)\bTIMESTAMP\b', 'TIMESTAMPTZ', line)   # CURRENT_TIMESTAMP khong bi anh huong
    line = re.sub(r'(?i)\bLONGTEXT\b|\bMEDIUMTEXT\b', 'TEXT', line)
    # Chi doi kieu du lieu JSON o dau khai bao cot, khong doi chuoi 'json'.
    line = re.sub(r'(?i)^(\s*\w+\s+)JSON\b', r'\1JSONB', line)
    line = re.sub(r'(?i)\s+ON UPDATE CURRENT_TIMESTAMP', '', line)
    line = re.sub(r'(?i)\)\s*ENGINE=\w+[^;]*;', ');', line)
    line = line.replace('`', '')
    out.append(line)

# 7) Dep dau phay thua truoc dau ) dong bang
txt = '\n'.join(out)
txt = re.sub(r',(\s*\n\s*\);)', r'\1', txt)

print(txt)
print('\n-- ===== INDEXES =====')
print('\n'.join(idx))
