-- =====================================================
-- CLOTHING STORE - Seed Data
-- Run: source schema.sql first, then this file
-- =====================================================


-- =====================================================
-- SIZES
-- =====================================================
INSERT INTO sizes (name, code, sort_order, is_active) VALUES
('S', 'S', 1, TRUE),
('M', 'M', 2, TRUE),
('L', 'L', 3, TRUE),
('XL', 'XL', 4, TRUE),
('XXL', 'XXL', 5, TRUE),
('3XL', '3XL', 6, TRUE),
('4XL', '4XL', 7, TRUE),
('5XL', '5XL', 8, TRUE);

-- =====================================================
-- COLORS
-- =====================================================
INSERT INTO colors (name, code, hex_code, sort_order, is_active) VALUES
('Đen', 'BLACK', '#000000', 1, TRUE),
('Trắng', 'WHITE', '#FFFFFF', 2, TRUE),
('Xám', 'GRAY', '#808080', 3, TRUE),
('Xanh Navy', 'NAVY', '#000080', 4, TRUE),
('Đỏ', 'RED', '#FF0000', 5, TRUE),
('Hồng', 'PINK', '#FFC0CB', 6, TRUE),
('Be', 'BE', '#F5F5DC', 7, TRUE),
('Nâu', 'BROWN', '#A52A2A', 8, TRUE),
('Xanh lá', 'GREEN', '#008000', 9, TRUE),
('Cam', 'ORANGE', '#FFA500', 10, TRUE),
('Tím', 'PURPLE', '#800080', 11, TRUE),
('Xanh Ngọc', 'TEAL', '#008080', 12, TRUE),
('Xanh Baby', 'BABY_BLUE', '#89CFF0', 13, TRUE),
('Vàng', 'YELLOW', '#FFFF00', 14, TRUE);

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, description, image, icon, sort_order, is_featured, is_active) VALUES
('Áo Thun', 'ao-thun', 'Áo thun các loại', 'https://2885371169.e.cdneverest.net//catalog/category/men-4_3_Ao-phong_Ao-phong-basic.webp', NULL, 1, TRUE, TRUE),
('Áo Sơ Mi', 'ao-so-mi', 'Áo sơ mi nam nữ', 'https://2885371169.e.cdneverest.net//catalog/category/men-6_1_Ao-so-mi_Tat-ca.webp', NULL, 2, TRUE, TRUE),
('Quần Jeans', 'quan-jeans', 'Quần jeans nam nữ', 'https://2885371169.e.cdneverest.net//catalog/category/men-7_2_Quan_Quan-jeans.webp', NULL, 3, TRUE, TRUE),
('Áo Blouse', 'ao-blouse', 'Áo blouse nữ', 'https://cdn.hstatic.net/products/1000402464/fwbl25fh07c__2__9894f50b0d6f419d849330beb60c5fe6_master.jpg', NULL, 4, TRUE, TRUE),
('Homewear', 'homewear', 'Đồ mặc nhà', NULL, NULL, 5, FALSE, TRUE),
('T-Shirt', 'tshirt', 'Áo T-Shirt', NULL, NULL, 6, FALSE, TRUE),
('Váy', 'vay', 'Váy nữ', NULL, NULL, 7, FALSE, TRUE),
('Áo Polo', 'ao-polo', 'Áo polo', NULL, NULL, 8, FALSE, TRUE),
('Quần Short', 'quan-short', 'Quần short', NULL, NULL, 9, FALSE, TRUE),
('Đồ lót', 'do-lot', 'Đồ lót', NULL, NULL, 10, FALSE, TRUE),
('Bé Gái', 'be-gai', 'Thời trang bé gái', NULL, NULL, 11, FALSE, TRUE),
('Bé Trai', 'be-trai', 'Thời trang bé trai', NULL, NULL, 12, FALSE, TRUE),
('Phụ Kiện', 'phu-kien', 'Phụ kiện thời trang', NULL, NULL, 13, FALSE, TRUE);

-- =====================================================
-- BRANDS
-- =====================================================
INSERT INTO brands (name, slug, logo, description, is_featured, is_active) VALUES
('CANIFA', 'canifa', NULL, 'Thương hiệu thời trang Việt Nam', TRUE, TRUE),
('CANIFA S', 'canifa-s', NULL, 'Thương hiệu cao cấp', TRUE, TRUE),
('Kids', 'kids', NULL, 'Thời trang trẻ em', TRUE, TRUE),
('CANIFA Move', 'canifa-move', NULL, 'Thời trang thể thao', FALSE, TRUE);

-- =====================================================
-- SUPPLIERS & WAREHOUSES
-- =====================================================
INSERT INTO suppliers (code, name, phone, email, address, contact_person, is_active) VALUES
('SUP-DEFAULT', 'Nhà cung cấp mặc định', '0900000000', 'supplier@example.com', 'Hà Nội', 'Bộ phận cung ứng', TRUE),
('SUP-CANIFA', 'Xưởng may CANIFA', '0912345678', 'sourcing@canifa.test', 'Khu công nghiệp dệt may', 'Phòng cung ứng', TRUE);

INSERT INTO warehouses (code, name, address, is_main, is_active) VALUES
('WH-MAIN', 'Kho chính', 'Kho trung tâm', TRUE, TRUE),
('WH-ONLINE', 'Kho online', 'Kho xử lý đơn online', FALSE, TRUE);

-- =====================================================
-- BANNERS
-- =====================================================
INSERT INTO banners (title, slug, image, link_url, description, sort_order, is_active, valid_from, valid_until) VALUES
('Banner chính 1', 'banner-1', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/2/8/2880x960007052026.webp', NULL, NULL, 1, TRUE, NOW(), NULL),
('Banner T-Shirt', 'banner-tshirt', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/a/o/aophong-desk-210326.webp', '/tshirt', NULL, 2, TRUE, NOW(), NULL),
('Banner SS', 'banner-ss', 'http://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/s/s/ssnd_topbanner_desktop-020526.webp', NULL, NULL, 3, TRUE, NOW(), NULL);

-- =====================================================
-- PROMOTIONS
-- =====================================================
INSERT INTO promotions (title, slug, description, image_url, discount_type, discount_value, start_date, end_date, is_active, is_featured) VALUES
('Flash Sale mùa hè', 'flash-sale-mua-he', 'Giảm giá nhanh cho các sản phẩm thời trang hè.', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/a/o/aophong-desk-210326.webp', 'percentage', 20, (now() - INTERVAL '1 DAY'), (now() + INTERVAL '7 DAY'), TRUE, TRUE),
('Ưu đãi cuối tuần', 'uu-dai-cuoi-tuan', 'Giảm trực tiếp cho đơn hàng trong dịp cuối tuần.', NULL, 'fixed_amount', 100000, NOW(), (now() + INTERVAL '3 DAY'), TRUE, FALSE);

-- =====================================================
-- VOUCHERS
-- =====================================================
INSERT INTO vouchers (code, title, description, discount_type, discount_value, min_order_amount, max_usage_total, max_usage_per_user, valid_from, valid_until, is_active, is_public) VALUES
('HETHAN1', 'Flash Sale 15%', 'Giảm 15% cho đơn từ 499k - Hết hạn trong 1 ngày!', 'percentage', 15, 499000, 300, 1, (now() - INTERVAL '2 DAY'), (now() + INTERVAL '1 DAY'), TRUE, TRUE),
('HETHAN2', 'Freeship 30K', 'Miễn phí vận chuyển - Hết hạn trong 2 ngày!', 'fixed_amount', 30000, 0, 500, 1, (now() - INTERVAL '1 DAY'), (now() + INTERVAL '2 DAY'), TRUE, TRUE),
('VOUCHER100K', 'Voucher 100K', 'Giảm 100k cho đơn từ 799k', 'fixed_amount', 100000, 799000, 1000, 1, NOW(), (now() + INTERVAL '3 DAY'), TRUE, TRUE),
('VOUCHER200K', 'Voucher 200K', 'Giảm 200k cho đơn từ 1.099k', 'fixed_amount', 200000, 1099000, 500, 1, NOW(), (now() + INTERVAL '5 DAY'), TRUE, TRUE),
('VOUCHER50K', 'Voucher 50K', 'Giảm 50k cho đơn từ 399k', 'fixed_amount', 50000, 399000, 2000, 1, NOW(), (now() + INTERVAL '2 MONTH'), TRUE, TRUE),
('NEWUSER80K', 'Voucher 80K', 'Giảm 80k cho đơn Online đầu tiên', 'fixed_amount', 80000, 0, 5000, 1, NOW(), (now() + INTERVAL '2 MONTH'), TRUE, TRUE);

-- =====================================================
-- COLLECTIONS
-- =====================================================
INSERT INTO collections (title, slug, description, image, cta, cta_text, sort_order, is_featured, is_active) VALUES
('DORAEMON', 'doraemon', 'Bộ sưu tập DORAEMON', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/o/doraemon_bst_homepage-140426.webp', '/collections/doraemon', 'Khám phá', 1, TRUE, TRUE),
('TỰ HÀO VIỆT NAM', 'tu-hao-viet-nam', 'Bộ sưu tập CANIFA S', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/c/a/canifas_bst_homepage-140426.webp', '/collections/canifa-s', 'Khám phá', 2, TRUE, TRUE),
('DISNEY', 'disney', 'Bộ sưu tập DISNEY', 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/i/disney_bst_homepage-140426.webp', '/collections/disney', 'Khám phá', 3, TRUE, TRUE);

-- =====================================================
-- PRODUCTS (30 products total)
-- id 1-6:  Homewear
-- id 7-11: T-Shirt
-- id 12-16: Váy
-- id 17-24: Featured
-- id 25-30: Best Sellers
-- =====================================================

INSERT INTO products (name, slug, short_description, description, price, compare_price, sku, stock, category_id, brand_id, gender, material, is_online_exclusive, is_featured, is_best_seller, is_active, total_sold) VALUES
-- HOMEWEAR (id 1-6)
('Bộ mặc nhà nữ', 'bo-mac-nha-nu', 'Bộ mặc nhà nữ cotton mềm mại, thoáng mát cả ngày', 'Bộ mặc nhà nữ, chất liệu cotton 100%, thoáng mát, thoải mái khi mặc ở nhà. Thiết kế đơn giản, dễ phối.', 399000, NULL, 'HW001', 0, 5, 1, 'female', 'Cotton 100%', FALSE, FALSE, FALSE, TRUE, 120),
('Bộ mặc nhà nam', 'bo-mac-nha-nam', 'Bộ mặc nhà nam basic, thoáng khí', 'Bộ mặc nhà nam, chất liệu cotton blend, thoáng khí, thoải mái.', 499000, NULL, 'HW002', 0, 5, 1, 'male', 'Cotton 65%/Polyester 35%', FALSE, FALSE, FALSE, TRUE, 98),
('Áo ngủ nữ cotton', 'ao-ngu-nu', 'Áo ngủ nữ cotton mát, thoải mái khi ngủ', 'Áo ngủ nữ, chất liệu cotton tự nhiên, thoáng mát khi ngủ. Phong cách nhẹ nhàng.', 299000, NULL, 'HW003', 0, 5, 1, 'female', 'Cotton 100%', TRUE, FALSE, FALSE, TRUE, 75),
('Quần soóc mặc nhà', 'quan-sooc-mac-nha', 'Quần soóc mặc nhà nam, phong cách basic', 'Quần soóc mặc nhà, chất liệu thoáng mát, phong cách. Co giãn tốt.', 199000, 299000, 'HW004', 0, 5, 1, 'male', 'Cotton 100%', FALSE, FALSE, FALSE, TRUE, 156),
('Bộ nỉ mặc nhà', 'bo-ni-mac-nha', 'Bộ nỉ mặc nhà ấm áp cho mùa đông', 'Bộ nỉ mặc nhà, vải nỉ cao cấp, giữ ấm tốt. Phù hợp mùa đông.', 599000, NULL, 'HW005', 0, 5, 1, 'male', 'Nỉ Cotton', FALSE, FALSE, FALSE, TRUE, 45),
('Đầm ngủ nữ', 'dam-ngu-nu', 'Đầm ngủ nữ cotton, phong cách nữ tính', 'Đầm ngủ nữ, chất liệu cotton mềm mại, phong cách nữ tính.', 449000, NULL, 'HW006', 0, 5, 1, 'female', 'Cotton 100%', TRUE, FALSE, FALSE, TRUE, 88),

-- T-SHIRT (id 7-11)
('Áo phông nữ cotton basic dáng suông', 'ao-phong-nu-cotton-basic', 'Áo phông nữ cotton basic dáng suông, phong cách basic', 'Áo phông nữ cotton basic dáng suông, phong cách basic, dễ mặc, dễ phối đồ. Chất cotton 100% mềm mại.', 209300, 299000, 'TS001', 0, 6, 1, 'female', 'Cotton 100%', FALSE, TRUE, TRUE, TRUE, 245),
('Áo phông nam cổ tròn', 'ao-phong-nam-co-tron', 'Áo phông nam cổ tròn basic, chất cotton mềm mại', 'Áo phông nam cổ tròn, chất cotton mềm mại, thoáng khí. Basic nhưng không kém phần thời trang.', 299000, NULL, 'TS002', 0, 6, 1, 'male', 'Cotton 100%', FALSE, TRUE, TRUE, TRUE, 189),
('Áo phông unisex form rộng', 'ao-phong-unisex-form-rong', 'Áo phông unisex form rộng, thoải mái, dễ phối', 'Áo phông unisex form rộng, thoải mái, dễ phối. Chất cotton co giãn nhẹ.', 349000, 449000, 'TS003', 0, 6, 1, 'unisex', 'Cotton 95%/Spandex 5%', FALSE, TRUE, FALSE, TRUE, 134),
('Áo phông nữ cổ V', 'ao-phong-nu-co-v', 'Áo phông nữ cổ V, dáng ôm nhẹ, tôn dáng', 'Áo phông nữ cổ V, dáng ôm nhẹ, tôn dáng. Thiết kế tinh tế cho các cô gái.', 259000, NULL, 'TS004', 0, 6, 1, 'female', 'Cotton 100%', FALSE, TRUE, FALSE, TRUE, 98),
('Áo phông nữ dài tay', 'ao-phong-nu-dai-tay', 'Áo phông nữ dài tay, ấm áp cho mùa đông', 'Áo phông nữ dài tay, chất cotton mềm, ấm áp. Phù hợp mùa đông hoặc đi làm.', 359000, NULL, 'TS005', 0, 6, 1, 'female', 'Cotton 100%', TRUE, FALSE, FALSE, TRUE, 67),

-- VÁY (id 12-16)
('Váy nữ maxi cotton', 'vay-nu-maxi', 'Váy nữ maxi cotton, dáng dài thoải mái', 'Váy nữ maxi cotton, dáng dài thoải mái, phong cách. Chất cotton nhẹ mát.', 699000, 899000, 'VY001', 0, 7, 1, 'female', 'Cotton 100%', FALSE, TRUE, TRUE, TRUE, 67),
('Chân váy mini', 'chan-vay-mini', 'Chân váy mini nữ, dáng trẻ trung', 'Chân váy mini, dáng trẻ trung, dễ phối đồ. Phù hợp nhiều dáng người.', 349000, NULL, 'VY002', 0, 7, 1, 'female', 'Cotton blend', FALSE, TRUE, FALSE, TRUE, 112),
('Váy đầm suông', 'vay-dam-suong', 'Váy đầm suông nữ, thoải mái', 'Váy đầm suông, thoải mái, phù hợp nhiều dáng người. Thiết kế tối giản.', 499000, 599000, 'VY003', 0, 7, 1, 'female', 'Rayon', FALSE, TRUE, FALSE, TRUE, 89),
('Váy chữ A', 'vay-chu-a', 'Váy chữ A nữ, dáng xòe nhẹ tôn dáng', 'Váy chữ A, dáng xòe nhẹ, tôn dáng. Cổ điển và nữ tính.', 449000, NULL, 'VY004', 0, 7, 1, 'female', 'Cotton 100%', FALSE, TRUE, TRUE, TRUE, 145),
('Váy đầm maxi', 'vay-dam-maxi', 'Váy đầm maxi nữ, phong cách bohemian', 'Váy đầm maxi, phong cách bohemian, lớp vải nhẹ bay. Mùa hè hoàn hảo.', 799000, 999000, 'VY005', 0, 7, 1, 'female', 'Voan', FALSE, FALSE, FALSE, TRUE, 55),

-- FEATURED PRODUCTS (id 17-24)
('Quần soóc bé trai', 'quan-sooc-be-trai', 'Quần soóc bé trai, chất liệu thoáng mát', 'Quần soóc bé trai, chất liệu thoáng mát, trẻ trung. Co giãn tốt cho bé vui chơi.', 499000, NULL, 'FE001', 0, 12, 3, 'kids_boy', 'Cotton 100%', FALSE, TRUE, FALSE, TRUE, 78),
('Quần soóc active nam', 'quan-sooc-active-nam', 'Quần soóc active nam, co giãn thoáng khí', 'Quần soóc active nam, co giãn, thoáng khí. Thể thao và năng động.', 599000, NULL, 'FE002', 0, 9, 1, 'male', 'Polyester/Elastane', FALSE, TRUE, FALSE, TRUE, 65),
('Quần soóc nam', 'quan-sooc-nam', 'Quần soóc nam basic, thoải mái cả ngày', 'Quần soóc nam basic, thoải mái cả ngày. Phong cách nam tính.', 599000, NULL, 'FE003', 0, 9, 1, 'male', 'Cotton 100%', FALSE, TRUE, TRUE, TRUE, 189),
('Áo polo nam dáng regular', 'ao-polo-nam', 'Áo polo nam dáng regular, lịch sự và thoải mái', 'Áo polo nam dáng regular, lịch sự và thoải mái. Cổ điển nam tính.', 399000, NULL, 'FE004', 0, 8, 1, 'male', 'Cotton/Polyester', FALSE, TRUE, FALSE, TRUE, 112),
('Áo sơ mi nam dài tay', 'ao-so-mi-nam-dai-tay', 'Áo sơ mi nam dài tay, phong cách công sở', 'Áo sơ mi nam dài tay, phong cách công sở. Lịch sự, chuyên nghiệp.', 599000, 699000, 'FE005', 0, 2, 1, 'male', 'Cotton 100%', FALSE, TRUE, FALSE, TRUE, 45),
('Áo blouse nữ', 'ao-blouse-nu', 'Áo blouse nữ, dáng thanh lịch', 'Áo blouse nữ, dáng thanh lịch, dễ phối. Văn phòng và dạo phố.', 349000, NULL, 'FE006', 0, 4, 1, 'female', 'Rayon', FALSE, TRUE, FALSE, TRUE, 134),
('Quần jeans nam straight', 'quan-jeans-nam-straight', 'Quần jeans nam straight, form classic', 'Quần jeans nam straight, form classic, bền đẹp theo thời gian.', 799000, 999000, 'FE007', 0, 3, 1, 'male', 'Denim', FALSE, TRUE, FALSE, TRUE, 89),
('Áo Thun bé gái', 'ao-thun-be-gai', 'Áo Thun bé gái, họa tiết dễ thương', 'Áo Thun bé gái, họa tiết dễ thương. Chất cotton mềm cho bé.', 199000, NULL, 'FE008', 0, 11, 3, 'kids_girl', 'Cotton 100%', FALSE, TRUE, FALSE, TRUE, 203),

-- BEST SELLERS (id 25-30)
('Áo phông nam dài tay', 'ao-phong-nam-dai-tay', 'Áo phông nam dài tay, basic', 'Áo phông nam dài tay, chất cotton thoáng mát. Phong cách basic.', 349000, NULL, 'BS001', 0, 6, 1, 'male', 'Cotton 100%', FALSE, FALSE, TRUE, TRUE, 312),
('Quần jeans nữ slim fit', 'quan-jeans-nu-slim-fit', 'Quần jeans nữ slim fit, ôm gọn', 'Quần jeans nữ slim fit, ôm gọn, tôn dáng. Co giãn nhẹ.', 599000, NULL, 'BS002', 0, 3, 1, 'female', 'Denim/Elastane', TRUE, FALSE, TRUE, TRUE, 278),
('Áo sơ mi nữ ngắn tay', 'ao-so-mi-nu-ngan-tay', 'Áo sơ mi nữ ngắn tay, thanh lịch', 'Áo sơ mi nữ ngắn tay, thanh lịch. Nữ tính và trẻ trung.', 399000, NULL, 'BS003', 0, 2, 1, 'female', 'Cotton 100%', FALSE, FALSE, TRUE, TRUE, 234),
('Quần soóc nữ', 'quan-sooc-nu', 'Quần soóc nữ, dáng ngắn năng động', 'Quần soóc nữ, dáng ngắn năng động. Mùa hè thoáng mát.', 349000, NULL, 'BS004', 0, 9, 1, 'female', 'Cotton 100%', FALSE, FALSE, TRUE, TRUE, 198),
('Áo polo nữ', 'ao-polo-nu', 'Áo polo nữ, phong cách thể thao', 'Áo polo nữ, phong cách thể thao năng động. Co giãn tốt.', 399000, NULL, 'BS005', 0, 8, 1, 'female', 'Cotton/Polyester', FALSE, FALSE, TRUE, TRUE, 176),
('Quần jeans bé gái', 'quan-jeans-be-gai', 'Quần jeans bé gái, trẻ trung', 'Quần jeans bé gái, trẻ trung và năng động. Chất bền đẹp.', 349000, NULL, 'BS006', 0, 11, 3, 'kids_girl', 'Denim', FALSE, FALSE, TRUE, TRUE, 165);

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary, is_online_exclusive) VALUES
-- HW001 (1)
(1, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s009-fe170-m-0-u.webp', 'Bộ mặc nhà nữ - Ảnh 1', 1, TRUE, FALSE),
(1, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s009-fe170-m-0-u.webp', 'Bộ mặc nhà nữ - Ảnh 2', 2, FALSE, FALSE),
-- HW002 (2)
(2, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/l/8ls26s001-sb968-1-thumb.webp', 'Bộ mặc nhà nam - Ảnh 1', 1, TRUE, FALSE),
(2, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/l/8ls26s002-sn127-2-thumb.webp', 'Bộ mặc nhà nam - Ảnh 2', 2, FALSE, FALSE),
-- HW003 (3)
(3, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s010-se249-m-0-u.webp', 'Áo ngủ nữ cotton - Ảnh 1', 1, TRUE, TRUE),
(3, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s001-fe173-m-0-u.webp', 'Áo ngủ nữ cotton - Ảnh 2', 2, FALSE, FALSE),
-- HW004 (4)
(4, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/l/8lb26a001-fb618-xl-1-u.webp', 'Quần soóc mặc nhà - Ảnh 1', 1, TRUE, FALSE),
(4, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/l/8lb26a002-sb968-xl-1-u.webp', 'Quần soóc mặc nhà - Ảnh 2', 2, FALSE, FALSE),
-- HW005 (5)
(5, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/s/8st25s001-sa142-1-thumb.webp', 'Bộ nỉ mặc nhà - Ảnh 1', 1, TRUE, FALSE),
(5, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s003-sl348-m-1-u.webp', 'Bộ nỉ mặc nhà - Ảnh 2', 2, FALSE, FALSE),
-- HW006 (6)
(6, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s005-dg011-1-thumb.webp', 'Đầm ngủ nữ - Ảnh 1', 1, TRUE, TRUE),
(6, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s005-dm033-1-thumb.webp', 'Đầm ngủ nữ - Ảnh 2', 2, FALSE, FALSE),
-- TS001 (7)
(7, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6ta26s001-sy306-m-1-u.webp', 'Áo phông nữ cotton basic - Ảnh 1', 1, TRUE, FALSE),
(7, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6ts26s030-sr031-1-thumb.webp', 'Áo phông nữ cotton basic - Ảnh 2', 2, FALSE, FALSE),
-- TS002 (8)
(8, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/5/t/5ts26s021-sw001-1-thumbab.webp', 'Áo phông nam cổ tròn - Ảnh 1', 1, TRUE, FALSE),
(8, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/t/8ts26s010-sk010-xl-1-u.webp', 'Áo phông nam cổ tròn - Ảnh 2', 2, FALSE, FALSE),
-- TS003 (9)
(9, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/5/t/5ts25s050-sk389-1-thumbb.webp', 'Áo phông unisex form rộng - Ảnh 1', 1, TRUE, FALSE),
(9, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/5/t/5ts25s044-sw001-1-thumb.webp', 'Áo phông unisex form rộng - Ảnh 2', 2, FALSE, FALSE),
-- TS004 (10)
(10, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s002-sm610-m-0-u.webp', 'Áo phông nữ cổ V - Ảnh 1', 1, TRUE, FALSE),
(10, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/l/6ls26s002-sw001-m-0-u.webp', 'Áo phông nữ cổ V - Ảnh 2', 2, FALSE, FALSE),
-- TS005 (11)
(11, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6to25c001-sn407-5.webp', 'Áo phông nữ dài tay - Ảnh 1', 1, TRUE, TRUE),
(11, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6tw24w013-sw033-thumb.webp', 'Áo phông nữ dài tay - Ảnh 2', 2, FALSE, FALSE),
-- VY001 (12)
(12, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds23w004-sm541-4-thumb.webp', 'Váy nữ maxi cotton - Ảnh 1', 1, TRUE, FALSE),
(12, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds23w005-sk010-1-thumb-n.webp', 'Váy nữ maxi cotton - Ảnh 2', 2, FALSE, FALSE),
-- VY002 (13)
(13, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/k/6ks26s006-sb246-2-thumb.webp', 'Chân váy mini - Ảnh 1', 1, TRUE, FALSE),
(13, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/k/6ks26s006-sp011-2-thumb.webp', 'Chân váy mini - Ảnh 2', 2, FALSE, FALSE),
-- VY003 (14)
(14, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25s007-sy161-1-thumb.webp', 'Váy đầm suông - Ảnh 1', 1, TRUE, FALSE),
(14, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25s012-sw001-thumb.webp', 'Váy đầm suông - Ảnh 2', 2, FALSE, FALSE),
-- VY004 (15)
(15, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25s012-sw001-thumb.webp', 'Váy chữ A - Ảnh 1', 1, TRUE, FALSE),
(15, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25s010-sk010-1-thumb.webp', 'Váy chữ A - Ảnh 2', 2, FALSE, FALSE),
-- VY005 (16)
(16, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25s010-sk010-1-thumb.webp', 'Váy đầm maxi - Ảnh 1', 1, TRUE, FALSE),
(16, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/d/6ds25c002-sa151-1-thumb.webp', 'Váy đầm maxi - Ảnh 2', 2, FALSE, FALSE),
-- FE001 (17)
(17, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/2/b/2bs25s002-sa026-1-thumb.webp', 'Quần soóc bé trai - Ảnh 1', 1, TRUE, FALSE),
(17, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/2/b/2bs25c001-sg153-1-thumb.webp', 'Quần soóc bé trai - Ảnh 2', 2, FALSE, FALSE),
-- FE002 (18)
(18, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/b/8bs25s012-se062-1-thumb.webp', 'Quần soóc active nam - Ảnh 1', 1, TRUE, FALSE),
-- FE003 (19)
(19, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/b/8bs25s005-sk010-1-thumb.webp', 'Quần soóc nam - Ảnh 1', 1, TRUE, FALSE),
(19, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/b/8bs25s006-sg322-1-thumb.webp', 'Quần soóc nam - Ảnh 2', 2, FALSE, FALSE),
-- FE004 (20)
(20, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/t/8tp26s015-sb001-xl-1-u.webp', 'Áo polo nam - Ảnh 1', 1, TRUE, FALSE),
-- FE005 (21)
(21, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/t/8th26s006-sw001-xl-1-u.webp', 'Áo sơ mi nam dài tay - Ảnh 1', 1, TRUE, FALSE),
(21, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/t/8th25a003-sw001-1-thumb.webp', 'Áo sơ mi nam dài tay - Ảnh 2', 2, FALSE, FALSE),
-- FE006 (22)
(22, 'https://cdn.hstatic.net/products/1000402464/fwbl25fh07c__2__9894f50b0d6f419d849330beb60c5fe6_master.jpg', 'Áo blouse nữ - Ảnh 1', 1, TRUE, FALSE),
-- FE007 (23)
(23, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/b/8bj25a005-sj885-1-thumb.webp', 'Quần jeans nam - Ảnh 1', 1, TRUE, FALSE),
(23, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/b/8bj25w002-sj951-1-thumb.webp', 'Quần jeans nam - Ảnh 2', 2, FALSE, FALSE),
-- FE008 (24)
(24, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/1/i/1it25w002-sw011-110-1-u.webp', 'Áo Thun bé gái - Ảnh 1', 1, TRUE, FALSE),
(24, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/1/i/1it25w001-sw011-110-1-u.webp', 'Áo Thun bé gái - Ảnh 2', 2, FALSE, FALSE),
-- BS001 (25)
(25, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/8/t/8tl25s001-sk124-thumb.webp', 'Áo phông nam dài tay - Ảnh 1', 1, TRUE, FALSE),
(25, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/5/t/5tl25w006-sa135-1-thumb.webp', 'Áo phông nam dài tay - Ảnh 2', 2, FALSE, FALSE),
-- BS002 (26)
(26, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/b/6bj23s002-sj799-5-a.webp', 'Quần jeans nữ slim fit - Ảnh 1', 1, TRUE, TRUE),
(26, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/b/6bj25w001-sj961-1-thumb.webp', 'Quần jeans nữ slim fit - Ảnh 2', 2, FALSE, FALSE),
-- BS003 (27)
(27, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/5/t/5th26s001-pb551-m-1-u.webp', 'Áo sơ mi nữ ngắn tay - Ảnh 1', 1, TRUE, FALSE),
-- BS004 (28)
(28, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/b/6bs26s015-se086-2-thumb.webp', 'Quần soóc nữ - Ảnh 1', 1, TRUE, FALSE),
(28, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/b/6bs26s015-sk010-2-thumb.webp', 'Quần soóc nữ - Ảnh 2', 2, FALSE, FALSE),
-- BS005 (29)
(29, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6tp26s002-pm104-m-1-u.webp', 'Áo polo nữ - Ảnh 1', 1, TRUE, FALSE),
(29, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/6/t/6tp26s002-pb546-m-1-u.webp', 'Áo polo nữ - Ảnh 2', 2, FALSE, FALSE),
-- BS006 (30)
(30, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/1/b/1bk25s001-sb001-1-thumb.webp', 'Quần jeans bé gái - Ảnh 1', 1, TRUE, FALSE),
(30, 'https://2885371169.e.cdneverest.net/catalog/product/cache/500_750/1/b/1bj25a001-sj911-1-thumb.webp', 'Quần jeans bé gái - Ảnh 2', 2, FALSE, FALSE);

-- =====================================================
-- PRODUCT VARIANTS (size + color) - ALL 30 PRODUCTS
-- Sizes: S(1), M(2), L(3), XL(4), XXL(5)
-- Colors: Đen(1), Trắng(2), Xám(3), Navy(4), Đỏ(5), Hồng(6), Be(7), Xanh Baby(13)
-- =====================================================

-- HW001 (1): Bộ mặc nhà nữ - Size S,M,L,XL - Màu Hồng(6), Xanh Baby(13), Be(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(1, 1, 6, 'HW001-S-HONG', 399000, 12), (1, 2, 6, 'HW001-M-HONG', 399000, 15), (1, 3, 6, 'HW001-L-HONG', 399000, 13), (1, 4, 6, 'HW001-XL-HONG', 399000, 10),
(1, 1, 13, 'HW001-S-BABY', 399000, 8), (1, 2, 13, 'HW001-M-BABY', 399000, 10), (1, 3, 13, 'HW001-L-BABY', 399000, 8),
(1, 1, 7, 'HW001-S-BE', 399000, 6), (1, 2, 7, 'HW001-M-BE', 399000, 8), (1, 3, 7, 'HW001-L-BE', 399000, 5);

-- HW002 (2): Bộ mặc nhà nam - Size S,M,L,XL - Màu Xám(3), Navy(4), Be(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(2, 1, 3, 'HW002-S-XAM', 499000, 10), (2, 2, 3, 'HW002-M-XAM', 499000, 12), (2, 3, 3, 'HW002-L-XAM', 499000, 10), (2, 4, 3, 'HW002-XL-XAM', 499000, 8),
(2, 1, 4, 'HW002-S-NAVY', 499000, 8), (2, 2, 4, 'HW002-M-NAVY', 499000, 10), (2, 3, 4, 'HW002-L-NAVY', 499000, 8), (2, 4, 4, 'HW002-XL-NAVY', 499000, 6),
(2, 1, 7, 'HW002-S-BE', 499000, 5), (2, 2, 7, 'HW002-M-BE', 499000, 7), (2, 3, 7, 'HW002-L-BE', 499000, 5);

-- HW003 (3): Áo ngủ nữ - Size S,M,L - Màu Hồng(6), Be(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(3, 1, 6, 'HW003-S-HONG', 299000, 15), (3, 2, 6, 'HW003-M-HONG', 299000, 20), (3, 3, 6, 'HW003-L-HONG', 299000, 15),
(3, 1, 7, 'HW003-S-BE', 299000, 10), (3, 2, 7, 'HW003-M-BE', 299000, 12), (3, 3, 7, 'HW003-L-BE', 299000, 8);

-- HW004 (4): Quần soóc mặc nhà - Size S,M,L,XL - Màu Xám(3), Navy(4)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(4, 1, 3, 'HW004-S-XAM', 199000, 20), (4, 2, 3, 'HW004-M-XAM', 199000, 25), (4, 3, 3, 'HW004-L-XAM', 199000, 20), (4, 4, 3, 'HW004-XL-XAM', 199000, 15),
(4, 1, 4, 'HW004-S-NAVY', 199000, 20), (4, 2, 4, 'HW004-M-NAVY', 199000, 25), (4, 3, 4, 'HW004-L-NAVY', 199000, 20), (4, 4, 4, 'HW004-XL-NAVY', 199000, 15);

-- HW005 (5): Bộ nỉ mặc nhà nam - Size M,L,XL,XXL - Màu Xám(3), Navy(4)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(5, 2, 3, 'HW005-M-XAM', 599000, 8), (5, 3, 3, 'HW005-L-XAM', 599000, 10), (5, 4, 3, 'HW005-XL-XAM', 599000, 10), (5, 5, 3, 'HW005-XXL-XAM', 599000, 7),
(5, 2, 4, 'HW005-M-NAVY', 599000, 8), (5, 3, 4, 'HW005-L-NAVY', 599000, 10), (5, 4, 4, 'HW005-XL-NAVY', 599000, 10), (5, 5, 4, 'HW005-XXL-NAVY', 599000, 7);

-- HW006 (6): Đầm ngủ nữ - Size S,M,L - Màu Hồng(6), Be(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(6, 1, 6, 'HW006-S-HONG', 449000, 12), (6, 2, 6, 'HW006-M-HONG', 449000, 15), (6, 3, 6, 'HW006-L-HONG', 449000, 10),
(6, 1, 7, 'HW006-S-BE', 449000, 8), (6, 2, 7, 'HW006-M-BE', 449000, 10), (6, 3, 7, 'HW006-L-BE', 449000, 8);

-- TS001 (7): Áo phông nữ cotton basic - Size S,M,L,XL - Màu Trắng(2), Đen(1), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(7, 1, 2, 'TS001-S-TRANG', 209300, 10), (7, 2, 2, 'TS001-M-TRANG', 209300, 12), (7, 3, 2, 'TS001-L-TRANG', 209300, 8), (7, 4, 2, 'TS001-XL-TRANG', 209300, 5),
(7, 1, 1, 'TS001-S-DEN', 209300, 8), (7, 2, 1, 'TS001-M-DEN', 209300, 10), (7, 3, 1, 'TS001-L-DEN', 209300, 6),
(7, 1, 3, 'TS001-S-XAM', 209300, 5), (7, 2, 3, 'TS001-M-XAM', 209300, 7), (7, 3, 3, 'TS001-L-XAM', 209300, 4);

-- TS002 (8): Áo phông nam cổ tròn - Size S,M,L,XL - Màu Trắng(2), Đen(1), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(8, 1, 2, 'TS002-S-TRANG', 299000, 12), (8, 2, 2, 'TS002-M-TRANG', 299000, 15), (8, 3, 2, 'TS002-L-TRANG', 299000, 12), (8, 4, 2, 'TS002-XL-TRANG', 299000, 8),
(8, 1, 1, 'TS002-S-DEN', 299000, 10), (8, 2, 1, 'TS002-M-DEN', 299000, 12), (8, 3, 1, 'TS002-L-DEN', 299000, 10), (8, 4, 1, 'TS002-XL-DEN', 299000, 6),
(8, 1, 3, 'TS002-S-XAM', 299000, 8), (8, 2, 3, 'TS002-M-XAM', 299000, 10), (8, 3, 3, 'TS002-L-XAM', 299000, 8);

-- TS003 (9): Áo phông unisex form rộng - Size S,M,L,XL,XXL - Màu Trắng(2), Đen(1), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(9, 1, 2, 'TS003-S-TRANG', 349000, 8), (9, 2, 2, 'TS003-M-TRANG', 349000, 10), (9, 3, 2, 'TS003-L-TRANG', 349000, 8), (9, 4, 2, 'TS003-XL-TRANG', 349000, 5), (9, 5, 2, 'TS003-XXL-TRANG', 349000, 4),
(9, 1, 1, 'TS003-S-DEN', 349000, 8), (9, 2, 1, 'TS003-M-DEN', 349000, 10), (9, 3, 1, 'TS003-L-DEN', 349000, 8), (9, 4, 1, 'TS003-XL-DEN', 349000, 5),
(9, 1, 3, 'TS003-S-XAM', 349000, 6), (9, 2, 3, 'TS003-M-XAM', 349000, 8), (9, 3, 3, 'TS003-L-XAM', 349000, 6);

-- TS004 (10): Áo phông nữ cổ V - Size S,M,L,XL - Màu Trắng(2), Đen(1), Hồng(6)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(10, 1, 2, 'TS004-S-TRANG', 259000, 8), (10, 2, 2, 'TS004-M-TRANG', 259000, 10), (10, 3, 2, 'TS004-L-TRANG', 259000, 6), (10, 4, 2, 'TS004-XL-TRANG', 259000, 4),
(10, 1, 1, 'TS004-S-DEN', 259000, 8), (10, 2, 1, 'TS004-M-DEN', 259000, 10), (10, 3, 1, 'TS004-L-DEN', 259000, 6),
(10, 1, 6, 'TS004-S-HONG', 259000, 6), (10, 2, 6, 'TS004-M-HONG', 259000, 8), (10, 3, 6, 'TS004-L-HONG', 259000, 4);

-- TS005 (11): Áo phông nữ dài tay - Size S,M,L,XL - Màu Trắng(2), Xám(3), Hồng(6)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(11, 1, 2, 'TS005-S-TRANG', 359000, 6), (11, 2, 2, 'TS005-M-TRANG', 359000, 8), (11, 3, 2, 'TS005-L-TRANG', 359000, 5), (11, 4, 2, 'TS005-XL-TRANG', 359000, 3),
(11, 1, 3, 'TS005-S-XAM', 359000, 5), (11, 2, 3, 'TS005-M-XAM', 359000, 7), (11, 3, 3, 'TS005-L-XAM', 359000, 4),
(11, 1, 6, 'TS005-S-HONG', 359000, 4), (11, 2, 6, 'TS005-M-HONG', 359000, 6), (11, 3, 6, 'TS005-L-HONG', 359000, 3);

-- VY001 (12): Váy nữ maxi - Size S,M,L - Màu Hồng(6), Be(7), Navy(4)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(12, 1, 6, 'VY001-S-HONG', 699000, 8), (12, 2, 6, 'VY001-M-HONG', 699000, 10), (12, 3, 6, 'VY001-L-HONG', 699000, 7),
(12, 1, 7, 'VY001-S-BE', 699000, 6), (12, 2, 7, 'VY001-M-BE', 699000, 8), (12, 3, 7, 'VY001-L-BE', 699000, 5),
(12, 1, 4, 'VY001-S-NAVY', 699000, 5), (12, 2, 4, 'VY001-M-NAVY', 699000, 6), (12, 3, 4, 'VY001-L-NAVY', 699000, 4);

-- VY002 (13): Chân váy mini - Size S,M,L,XL - Màu Đen(1), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(13, 1, 1, 'VY002-S-DEN', 349000, 12), (13, 2, 1, 'VY002-M-DEN', 349000, 15), (13, 3, 1, 'VY002-L-DEN', 349000, 10), (13, 4, 1, 'VY002-XL-DEN', 349000, 6),
(13, 1, 3, 'VY002-S-XAM', 349000, 8), (13, 2, 3, 'VY002-M-XAM', 349000, 10), (13, 3, 3, 'VY002-L-XAM', 349000, 7);

-- VY003 (14): Váy đầm suông - Size S,M,L,XL - Màu Hồng(6), Be(7), Trắng(2)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(14, 1, 6, 'VY003-S-HONG', 499000, 8), (14, 2, 6, 'VY003-M-HONG', 499000, 10), (14, 3, 6, 'VY003-L-HONG', 499000, 7), (14, 4, 6, 'VY003-XL-HONG', 499000, 4),
(14, 1, 7, 'VY003-S-BE', 499000, 6), (14, 2, 7, 'VY003-M-BE', 499000, 8), (14, 3, 7, 'VY003-L-BE', 499000, 5),
(14, 1, 2, 'VY003-S-TRANG', 499000, 5), (14, 2, 2, 'VY003-M-TRANG', 499000, 7), (14, 3, 2, 'VY003-L-TRANG', 499000, 4);

-- VY004 (15): Váy chữ A - Size S,M,L,XL - Màu Trắng(2), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(15, 1, 2, 'VY004-S-TRANG', 449000, 10), (15, 2, 2, 'VY004-M-TRANG', 449000, 12), (15, 3, 2, 'VY004-L-TRANG', 449000, 8), (15, 4, 2, 'VY004-XL-TRANG', 449000, 5),
(15, 1, 1, 'VY004-S-DEN', 449000, 8), (15, 2, 1, 'VY004-M-DEN', 449000, 10), (15, 3, 1, 'VY004-L-DEN', 449000, 7), (15, 4, 1, 'VY004-XL-DEN', 449000, 4);

-- VY005 (16): Váy đầm maxi - Size S,M,L - Màu Be(7), Hồng(6)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(16, 1, 7, 'VY005-S-BE', 799000, 6), (16, 2, 7, 'VY005-M-BE', 799000, 8), (16, 3, 7, 'VY005-L-BE', 799000, 5),
(16, 1, 6, 'VY005-S-HONG', 799000, 5), (16, 2, 6, 'VY005-M-HONG', 799000, 7), (16, 3, 6, 'VY005-L-HONG', 799000, 4);

-- FE001 (17): Quần soóc bé trai - Size S,M,L,XL - Màu Trắng(2), Xanh Baby(13)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(17, 1, 2, 'FE001-S-TRANG', 499000, 10), (17, 2, 2, 'FE001-M-TRANG', 499000, 12), (17, 3, 2, 'FE001-L-TRANG', 499000, 10), (17, 4, 2, 'FE001-XL-TRANG', 499000, 6),
(17, 1, 13, 'FE001-S-BABY', 499000, 8), (17, 2, 13, 'FE001-M-BABY', 499000, 10), (17, 3, 13, 'FE001-L-BABY', 499000, 8);

-- FE002 (18): Quần soóc active nam - Size S,M,L,XL - Màu Đen(1), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(18, 1, 1, 'FE002-S-DEN', 599000, 8), (18, 2, 1, 'FE002-M-DEN', 599000, 10), (18, 3, 1, 'FE002-L-DEN', 599000, 8), (18, 4, 1, 'FE002-XL-DEN', 599000, 5),
(18, 1, 3, 'FE002-S-XAM', 599000, 6), (18, 2, 3, 'FE002-M-XAM', 599000, 8), (18, 3, 3, 'FE002-L-XAM', 599000, 6), (18, 4, 3, 'FE002-XL-XAM', 599000, 4);

-- FE003 (19): Quần soóc nam - Size S,M,L,XL,XXL - Màu Trắng(2), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(19, 1, 2, 'FE003-S-TRANG', 599000, 12), (19, 2, 2, 'FE003-M-TRANG', 599000, 15), (19, 3, 2, 'FE003-L-TRANG', 599000, 12), (19, 4, 2, 'FE003-XL-TRANG', 599000, 8), (19, 5, 2, 'FE003-XXL-TRANG', 599000, 5),
(19, 1, 1, 'FE003-S-DEN', 599000, 10), (19, 2, 1, 'FE003-M-DEN', 599000, 12), (19, 3, 1, 'FE003-L-DEN', 599000, 10), (19, 4, 1, 'FE003-XL-DEN', 599000, 6), (19, 5, 1, 'FE003-XXL-DEN', 599000, 4);

-- FE004 (20): Áo polo nam - Size S,M,L,XL,XXL - Màu Trắng(2), Navy(4)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(20, 1, 2, 'FE004-S-TRANG', 399000, 10), (20, 2, 2, 'FE004-M-TRANG', 399000, 12), (20, 3, 2, 'FE004-L-TRANG', 399000, 10), (20, 4, 2, 'FE004-XL-TRANG', 399000, 6), (20, 5, 2, 'FE004-XXL-TRANG', 399000, 4),
(20, 1, 4, 'FE004-S-NAVY', 399000, 8), (20, 2, 4, 'FE004-M-NAVY', 399000, 10), (20, 3, 4, 'FE004-L-NAVY', 399000, 8), (20, 4, 4, 'FE004-XL-NAVY', 399000, 5), (20, 5, 4, 'FE004-XXL-NAVY', 399000, 3);

-- FE005 (21): Áo sơ mi nam dài tay - Size S,M,L,XL - Màu Trắng(2), Xanh Baby(13), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(21, 1, 2, 'FE005-S-TRANG', 599000, 8), (21, 2, 2, 'FE005-M-TRANG', 599000, 10), (21, 3, 2, 'FE005-L-TRANG', 599000, 6), (21, 4, 2, 'FE005-XL-TRANG', 599000, 4),
(21, 1, 13, 'FE005-S-BABY', 599000, 6), (21, 2, 13, 'FE005-M-BABY', 599000, 8), (21, 3, 13, 'FE005-L-BABY', 599000, 5),
(21, 1, 1, 'FE005-S-DEN', 599000, 5), (21, 2, 1, 'FE005-M-DEN', 599000, 7), (21, 3, 1, 'FE005-L-DEN', 599000, 4);

-- FE006 (22): Áo blouse nữ - Size S,M,L,XL - Màu Trắng(2), Xanh Baby(13)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(22, 1, 2, 'FE006-S-TRANG', 349000, 12), (22, 2, 2, 'FE006-M-TRANG', 349000, 15), (22, 3, 2, 'FE006-L-TRANG', 349000, 10), (22, 4, 2, 'FE006-XL-TRANG', 349000, 6),
(22, 1, 13, 'FE006-S-BABY', 349000, 8), (22, 2, 13, 'FE006-M-BABY', 349000, 10), (22, 3, 13, 'FE006-L-BABY', 349000, 7);

-- FE007 (23): Quần jeans nam straight - Size S,M,L,XL,XXL - Màu Navy(4), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(23, 1, 4, 'FE007-S-NAVY', 799000, 6), (23, 2, 4, 'FE007-M-NAVY', 799000, 8), (23, 3, 4, 'FE007-L-NAVY', 799000, 6), (23, 4, 4, 'FE007-XL-NAVY', 799000, 4), (23, 5, 4, 'FE007-XXL-NAVY', 799000, 3),
(23, 1, 1, 'FE007-S-DEN', 799000, 5), (23, 2, 1, 'FE007-M-DEN', 799000, 7), (23, 3, 1, 'FE007-L-DEN', 799000, 5), (23, 4, 1, 'FE007-XL-DEN', 799000, 3);

-- FE008 (24): Áo Thun bé gái - Size S,M,L,XL - Màu Hồng(6), Trắng(2)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(24, 1, 6, 'FE008-S-HONG', 199000, 15), (24, 2, 6, 'FE008-M-HONG', 199000, 18), (24, 3, 6, 'FE008-L-HONG', 199000, 12), (24, 4, 6, 'FE008-XL-HONG', 199000, 8),
(24, 1, 2, 'FE008-S-TRANG', 199000, 12), (24, 2, 2, 'FE008-M-TRANG', 199000, 15), (24, 3, 2, 'FE008-L-TRANG', 199000, 10), (24, 4, 2, 'FE008-XL-TRANG', 199000, 6);

-- BS001 (25): Áo phông nam dài tay - Size S,M,L,XL,XXL - Màu Trắng(2), Xám(3), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(25, 1, 2, 'BS001-S-TRANG', 349000, 15), (25, 2, 2, 'BS001-M-TRANG', 349000, 18), (25, 3, 2, 'BS001-L-TRANG', 349000, 15), (25, 4, 2, 'BS001-XL-TRANG', 349000, 10), (25, 5, 2, 'BS001-XXL-TRANG', 349000, 6),
(25, 1, 3, 'BS001-S-XAM', 349000, 10), (25, 2, 3, 'BS001-M-XAM', 349000, 12), (25, 3, 3, 'BS001-L-XAM', 349000, 10), (25, 4, 3, 'BS001-XL-XAM', 349000, 6),
(25, 1, 1, 'BS001-S-DEN', 349000, 8), (25, 2, 1, 'BS001-M-DEN', 349000, 10), (25, 3, 1, 'BS001-L-DEN', 349000, 8), (25, 4, 1, 'BS001-XL-DEN', 349000, 5);

-- BS002 (26): Quần jeans nữ slim fit - Size S,M,L,XL - Màu Navy(4), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(26, 1, 4, 'BS002-S-NAVY', 599000, 10), (26, 2, 4, 'BS002-M-NAVY', 599000, 15), (26, 3, 4, 'BS002-L-NAVY', 599000, 12), (26, 4, 4, 'BS002-XL-NAVY', 599000, 8),
(26, 1, 1, 'BS002-S-DEN', 599000, 8), (26, 2, 1, 'BS002-M-DEN', 599000, 12), (26, 3, 1, 'BS002-L-DEN', 599000, 10), (26, 4, 1, 'BS002-XL-DEN', 599000, 6);

-- BS003 (27): Áo sơ mi nữ ngắn tay - Size S,M,L,XL - Màu Trắng(2), Hồng(6)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(27, 1, 2, 'BS003-S-TRANG', 399000, 12), (27, 2, 2, 'BS003-M-TRANG', 399000, 15), (27, 3, 2, 'BS003-L-TRANG', 399000, 12), (27, 4, 2, 'BS003-XL-TRANG', 399000, 8),
(27, 1, 6, 'BS003-S-HONG', 399000, 10), (27, 2, 6, 'BS003-M-HONG', 399000, 12), (27, 3, 6, 'BS003-L-HONG', 399000, 10), (27, 4, 6, 'BS003-XL-HONG', 399000, 5);

-- BS004 (28): Quần soóc nữ - Size S,M,L,XL - Màu Đen(1), Trắng(2), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(28, 1, 1, 'BS004-S-DEN', 349000, 14), (28, 2, 1, 'BS004-M-DEN', 349000, 18), (28, 3, 1, 'BS004-L-DEN', 349000, 14), (28, 4, 1, 'BS004-XL-DEN', 349000, 8),
(28, 1, 2, 'BS004-S-TRANG', 349000, 10), (28, 2, 2, 'BS004-M-TRANG', 349000, 12), (28, 3, 2, 'BS004-L-TRANG', 349000, 10), (28, 4, 2, 'BS004-XL-TRANG', 349000, 5),
(28, 1, 3, 'BS004-S-XAM', 349000, 8), (28, 2, 3, 'BS004-M-XAM', 349000, 10), (28, 3, 3, 'BS004-L-XAM', 349000, 8);

-- BS005 (29): Áo polo nữ - Size S,M,L,XL - Màu Trắng(2), Hồng(6), Navy(4)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(29, 1, 2, 'BS005-S-TRANG', 399000, 10), (29, 2, 2, 'BS005-M-TRANG', 399000, 12), (29, 3, 2, 'BS005-L-TRANG', 399000, 10), (29, 4, 2, 'BS005-XL-TRANG', 399000, 6),
(29, 1, 6, 'BS005-S-HONG', 399000, 8), (29, 2, 6, 'BS005-M-HONG', 399000, 10), (29, 3, 6, 'BS005-L-HONG', 399000, 8), (29, 4, 6, 'BS005-XL-HONG', 399000, 4),
(29, 1, 4, 'BS005-S-NAVY', 399000, 6), (29, 2, 4, 'BS005-M-NAVY', 399000, 8), (29, 3, 4, 'BS005-L-NAVY', 399000, 6);

-- BS006 (30): Quần jeans bé gái - Size S,M,L,XL - Màu Navy(4), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, price, stock) VALUES
(30, 1, 4, 'BS006-S-NAVY', 349000, 12), (30, 2, 4, 'BS006-M-NAVY', 349000, 15), (30, 3, 4, 'BS006-L-NAVY', 349000, 12), (30, 4, 4, 'BS006-XL-NAVY', 349000, 6),
(30, 1, 1, 'BS006-S-DEN', 349000, 8), (30, 2, 1, 'BS006-M-DEN', 349000, 10), (30, 3, 1, 'BS006-L-DEN', 349000, 8), (30, 4, 1, 'BS006-XL-DEN', 349000, 5);

-- =====================================================
-- UPDATE products.stock FROM variants
-- =====================================================
UPDATE products AS p
SET stock = v.total_stock
FROM (
  SELECT product_id, SUM(stock)::INT AS total_stock
  FROM product_variants
  GROUP BY product_id
) AS v
WHERE v.product_id = p.id;

-- =====================================================
-- BEST SELLERS
-- =====================================================
INSERT INTO best_sellers (product_id, sort_order, is_active) VALUES
(7, 1, TRUE), (8, 2, TRUE), (19, 3, TRUE), (15, 4, TRUE),
(12, 5, TRUE), (25, 6, TRUE), (26, 7, TRUE), (27, 8, TRUE);

-- =====================================================
-- NEWS (Blog)
-- =====================================================
INSERT INTO news (title, slug, summary, content, thumbnail, author_name, category, view_count, is_featured, is_published, published_at) VALUES
('Size L là bao nhiêu kg? Bảng size chuẩn nam nữ & cách chọn đúng', 'size-l-la-bao-nhieu-kg', 'Tìm hiểu size L là bao nhiêu kg với bảng size chuẩn cho nam và nữ, cùng hướng dẫn cách đo cơ thể và chọn size đúng.', '<p>Nội dung chi tiết về bảng size...</p>', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1275&q=80', 'CANIFA', 'Thuật ngữ - Kiến thức', 1250, FALSE, TRUE, NOW()),
('Chân váy dài mặc với áo gì đẹp? 15 cách phối chuẩn dáng', 'chan-vay-dai-mac-voi-ao-gi', 'Hướng dẫn phối đồ với chân váy dài đẹp và chuẩn dáng cho mọi vóc dáng.', '<p>Nội dung chi tiết về phối đồ...</p>', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=556&q=80', 'CANIFA', 'Phối đồ', 890, FALSE, TRUE, (now() - INTERVAL '1 DAY')),
('Outfit Đà Lạt đẹp: Cách phối đồ theo mùa và dáng người', 'outfit-da-lat', 'Gợi ý outfit Đà Lạt đẹp cho mùa hè và mùa đông, phù hợp mọi phong cách.', '<p>Nội dung chi tiết về outfit...</p>', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=556&q=80', 'CANIFA', 'Phối đồ', 670, FALSE, TRUE, (now() - INTERVAL '2 DAY')),
('Size S là bao nhiêu kg? Bảng size chuẩn nam nữ chi tiết', 'size-s-la-bao-nhieu-kg', 'Tìm hiểu size S là bao nhiêu kg với bảng size chuẩn chi tiết cho nam và nữ.', '<p>Nội dung chi tiết về size...</p>', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=556&q=80', 'CANIFA', 'Thuật ngữ - Kiến thức', 430, FALSE, TRUE, (now() - INTERVAL '3 DAY')),
('Stylist là gì? Công việc, kỹ năng và cơ hội nghề nghiệp 2026', 'stylist-la-gi', 'Tìm hiểu về nghề stylist, công việc, kỹ năng cần có và cơ hội nghề nghiệp.', '<p>Nội dung chi tiết về nghề stylist...</p>', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=556&q=80', 'CANIFA', 'Thuật ngữ - Kiến thức', 320, FALSE, TRUE, (now() - INTERVAL '4 DAY')),
('Xu hướng thời trang 2026: Những gì đang hot trên thị trường', 'xu-huong-thoi-trang-2026', 'Khám phá những xu hướng thời trang nổi bật nhất năm 2026 tại Việt Nam và thế giới.', '<p>Nội dung chi tiết về xu hướng...</p>', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=556&q=80', 'CANIFA', 'Xu hướng', 580, FALSE, TRUE, (now() - INTERVAL '5 DAY'));

-- =====================================================
-- USERS (Admin + Customers)
-- =====================================================
INSERT INTO users (name, email, password, role, is_active, created_at) VALUES
('Admin CANIFA', 'admin@canifa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, NOW()),
('Nguyễn Văn A', 'user1@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', TRUE, NOW()),
('Trần Thị B', 'user2@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', TRUE, NOW());

-- =====================================================
-- NEWSLETTER
-- =====================================================
INSERT INTO newsletter (email, is_active, subscribed_at) VALUES
('customer1@example.com', TRUE, NOW()),
('customer2@example.com', TRUE, NOW()),
('customer3@example.com', TRUE, (now() - INTERVAL '1 MONTH')),
('fashionista@example.com', TRUE, (now() - INTERVAL '2 WEEK'));

-- =====================================================
-- SETTINGS
-- =====================================================
INSERT INTO settings (setting_key, setting_value, setting_type, group_name) VALUES
('store_name', 'CANIFA', 'string', 'general'),
('store_phone', '19001234', 'string', 'general'),
('store_email', 'contact@canifa.com', 'string', 'general'),
('store_address', 'Hà Nội, Việt Nam', 'string', 'general'),
('shipping_fee_default', '30000', 'number', 'shipping'),
('free_shipping_threshold', '499000', 'number', 'shipping'),
('points_per_vnd', '1', 'number', 'loyalty'),
('welcome_points', '100', 'number', 'loyalty'),
('app_download_url', 'https://app.canifa.com', 'string', 'app'),
('clive_enabled', 'true', 'boolean', 'app');
