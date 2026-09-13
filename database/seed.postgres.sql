-- =====================================================
-- CLOTHING STORE - Seed data cho PostgreSQL / Supabase
-- Sinh tu database/seed.sql (MySQL) bang convert_seed.py
-- =====================================================

-- Xoa sach du lieu cu (CASCADE vi Postgres ton trong khoa ngoai)
TRUNCATE TABLE activity_logs, notifications, coupon_usage, order_items, orders, cart_items, wishlists, reward_points, return_requests, product_reviews, supplier_order_items, supplier_orders, shipping_fees, shipping_zones, shipping_providers, payment_methods, expenses, expense_categories, stock_movements, product_variants, product_images, products, coupons, promotions, news, contacts, brands, suppliers, employees, warehouses, colors, sizes, categories, settings, addresses, users RESTART IDENTITY CASCADE;
-- =====================================================
-- CLOTHING STORE - Seed Data
-- Complete Store Management System
-- =====================================================



-- =====================================================
-- Clean existing data (safe for re-run)
-- =====================================================







































-- =====================================================
-- Seed: Warehouses
-- =====================================================
INSERT INTO warehouses (name, code, address, phone, is_main, is_active) VALUES
('Kho Hàng Chính TP.HCM', 'KHO-HCM-001', '123 Đường số 5, KCN Tân Thuận, Quận 7, TP.HCM', '02812345678', TRUE, TRUE),
('Kho Hàng Hà Nội', 'KHO-HN-001', '456 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội', '02412345678', FALSE, TRUE),
('Kho Hàng Cần Thơ', 'KHO-CT-001', '789 Đường 30 Tháng 4, Quận Ninh Kiều, Cần Thơ', '02921234567', FALSE, TRUE);

-- =====================================================
-- Seed: Suppliers
-- =====================================================
INSERT INTO suppliers (name, code, email, phone, address, tax_code, contact_person, bank_account, bank_name, debt_limit, is_active) VALUES
('Công Ty TNHH Thời Trang Phương Nam', 'NCC-001', 'phuongnam@fashion.vn', '02834567890', '123 Lý Thường Kiệt, Quận 10, TP.HCM', '0301234567', 'Nguyễn Văn Nam', '1234567890', 'Ngân hàng Vietcombank', 100000000, TRUE),
('Công Ty CP Dệt May Thắng Lợi', 'NCC-002', 'thangloi@textile.vn', '02845678901', '456 Trần Phú, Quận 5, TP.HCM', '0302345678', 'Trần Thị Lan', '2345678901', 'Ngân hàng BIDV', 150000000, TRUE),
('Hai Yen Fashion Co., Ltd', 'NCC-003', 'info@haiyen.vn', '02456789012', '789 Hoàng Quốc Việt, Hà Nội', '0102345678', 'Lê Minh Hùng', '3456789012', 'Ngân hàng Vietinbank', 200000000, TRUE),
('Công Ty TNHH Vải Bảo Châu', 'NCC-004', 'baochau@fabric.vn', '02867890123', '321 Nguyễn Trãi, Quận 1, TP.HCM', '0303456789', 'Phạm Thị Bảo', '4567890123', 'Ngân hàng ACB', 50000000, TRUE),
('PT Fashion Indonesia', 'NCC-005', 'sales@ptfashion.id', '+6221123456', 'Jakarta, Indonesia', 'ID2345678', 'Ahmad Wijaya', '5678901234', 'Bank Central Asia', 300000000, TRUE);

-- =====================================================
-- Seed: Users
-- Password: admin123 -> $2a$10$NpvovbVVIc1Y/mipPgtcSO0fhnBPlpuAcOfFrk4/EmxZAezviNGnK
-- Password: user123  -> $2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK
-- =====================================================
INSERT INTO users (name, email, password, phone, address, role, gender, birth_date, member_level, default_city, default_district, default_address, reward_points, total_spent, is_active) VALUES
('Admin Shop', 'admin@clothing-store.vn', '$2a$10$NpvovbVVIc1Y/mipPgtcSO0fhnBPlpuAcOfFrk4/EmxZAezviNGnK', '0909123456', '456 Nguyễn Trãi, Quận 5, TP.HCM', 'admin', 'male', '1990-05-15', 'Gold', 'TP.HCM', 'Quận 5', '456 Nguyễn Trãi', 0, 0, TRUE),
('Nguyễn Thị Lan', 'lan.nguyen@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0901234567', '78 Cái Khế, Quận Ninh Kiều, Cần Thơ', 'user', 'female', '1995-03-20', 'Silver', 'Cần Thơ', 'Quận Ninh Kiều', '78 Cái Khế', 1500, 5500000, TRUE),
('Trần Văn Minh', 'minh.tran@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0912345678', '23 Đường 3 Tháng 2, Quận 10, TP.HCM', 'user', 'male', '1992-08-12', 'Gold', 'TP.HCM', 'Quận 10', '23 Đường 3 Tháng 2', 2800, 8900000, TRUE),
('Lê Hoài Trang', 'trang.le@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0934567890', '56 Lý Tự Trọng, Quận 1, TP.HCM', 'user', 'female', '1998-12-05', 'Bronze', 'TP.HCM', 'Quận 1', '56 Lý Tự Trọng', 500, 1800000, TRUE),
('Phạm Đức Anh', 'anh.pham@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0945678901', '89 Pasteur, Quận 3, TP.HCM', 'user', 'male', '1993-06-25', 'Silver', 'TP.HCM', 'Quận 3', '89 Pasteur', 1200, 4200000, TRUE),
('Võ Thị Mai Hương', 'huong.vo@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0956789012', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'user', 'female', '1997-01-10', 'Bronze', 'TP.HCM', 'Quận 1', '123 Nguyễn Huệ', 800, 3200000, TRUE),
('Hoàng Đức Mạnh', 'manh.hoang@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0967890123', '456 Trần Hưng Đạo, Quận 5, TP.HCM', 'user', 'male', '1991-09-18', 'Silver', 'TP.HCM', 'Quận 5', '456 Trần Hưng Đạo', 2200, 7500000, TRUE),
('Trương Thị Hạnh', 'hanh.truong@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0978901234', '789 Lê Lai, Quận 3, TP.HCM', 'user', 'female', '1996-04-22', 'Bronze', 'TP.HCM', 'Quận 3', '789 Lê Lai', 600, 2100000, TRUE);

-- =====================================================
-- Seed: Employees
-- =====================================================
INSERT INTO employees (user_id, employee_code, first_name, last_name, full_name, email, phone, id_card, birth_date, gender, address, position, department, hire_date, salary, commission_rate, is_active) VALUES
(1, 'EMP-001', 'Minh', 'Nguyễn', 'Nguyễn Minh', 'admin@clothing-store.vn', '0909123456', '079195001234', '1990-05-15', 'male', '456 Nguyễn Trãi, Q5, TP.HCM', 'Quản lý cửa hàng', 'Quản lý', '2020-01-15', 15000000, 5.00, TRUE),
(NULL, 'EMP-002', 'Thanh', 'Lê', 'Lê Thanh', 'thanh.le@clothing-store.vn', '0911111111', '079195001235', '1992-03-10', 'female', '123 Lê Lợi, Q1, TP.HCM', 'Nhân viên bán hàng', 'Kinh doanh', '2021-03-01', 8000000, 3.00, TRUE),
(NULL, 'EMP-003', 'Hùng', 'Trần', 'Trần Hùng', 'hung.tran@clothing-store.vn', '0922222222', '079195001236', '1994-07-20', 'male', '456 Đồng Khởi, Q1, TP.HCM', 'Nhân viên kho', 'Kho vận', '2021-06-15', 7500000, 2.00, TRUE),
(NULL, 'EMP-004', 'Hà', 'Ngô', 'Ngô Thị Hà', 'ha.ngo@clothing-store.vn', '0933333333', '079195001237', '1995-11-05', 'female', '789 Pasteur, Q3, TP.HCM', 'Nhân viên chăm sóc khách hàng', 'Chăm sóc khách hàng', '2022-01-10', 7000000, 2.50, TRUE),
(NULL, 'EMP-005', 'Dũng', 'Lý', 'Lý Văn Dũng', 'dung.ly@clothing-store.vn', '0944444444', '079195001238', '1993-09-15', 'male', '321 Võ Văn Tần, Q3, TP.HCM', 'Kế toán', 'Tài chính', '2021-09-01', 9000000, 0.00, TRUE);

-- =====================================================
-- Seed: Addresses
-- =====================================================
INSERT INTO addresses (user_id, full_name, phone, address, ward, district, city, is_default) VALUES
(2, 'Nguyễn Thị Lan', '0901234567', '78 Cái Khế', 'Cái Khế', 'Quận Ninh Kiều', 'Cần Thơ', TRUE),
(3, 'Trần Văn Minh', '0912345678', '23 Đường 3 Tháng 2', 'Phường 10', 'Quận 10', 'TP.HCM', TRUE),
(4, 'Lê Hoài Trang', '0934567890', '56 Lý Tự Trọng', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', TRUE),
(5, 'Phạm Đức Anh', '0945678901', '89 Pasteur', 'Phường 6', 'Quận 3', 'TP.HCM', TRUE),
(6, 'Võ Thị Mai Hương', '0956789012', '123 Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', TRUE),
(7, 'Hoàng Đức Mạnh', '0967890123', '456 Trần Hưng Đạo', 'Phường 11', 'Quận 5', 'TP.HCM', TRUE),
(8, 'Trương Thị Hạnh', '0978901234', '789 Lê Lai', 'Phường 6', 'Quận 3', 'TP.HCM', TRUE);

-- =====================================================
-- Seed: Categories
-- =====================================================
INSERT INTO categories (name, slug, description, icon, sort_order, is_featured, is_active) VALUES
-- Nam
('Áo Thun Nam', 'ao-thun-nam', 'Áo thun nam các loại', 'tshirt', 1, TRUE, TRUE),
('Áo Sơ Mi Nam', 'ao-so-mi-nam', 'Áo sơ mi nam công sở và casual', 'shirt', 2, TRUE, TRUE),
('Áo Polo Nam', 'ao-polo-nam', 'Áo polo nam thể thao và casual', 'activity', 3, FALSE, TRUE),
('Quần Jeans Nam', 'quan-jeans-nam', 'Quần jeans nam các form', 'square', 4, TRUE, TRUE),
('Quần Tây Nam', 'quan-tay-nam', 'Quần âu nam công sở', 'briefcase', 5, FALSE, TRUE),
('Quần Short Nam', 'quan-short-nam', 'Quần short nam mùa hè', 'sun', 6, FALSE, TRUE),
-- Nữ
('Áo Blouse Nữ', 'ao-blouse-nu', 'Áo blouse nữ công sở', 'shirt', 7, TRUE, TRUE),
('Áo Thun Nữ', 'ao-thun-nu', 'Áo thun nữ basic và trendy', 'tshirt', 8, TRUE, TRUE),
('Áo Croptop', 'ao-croptop', 'Áo croptop nữ', 'star', 9, FALSE, TRUE),
('Chân Váy', 'chan-vay', 'Chân váy các loại', 'triangle', 10, TRUE, TRUE),
('Đầm Nữ', 'dam-nu', 'Đầm nữ các kiểu', 'heart', 11, TRUE, TRUE),
('Quần Nữ', 'quan-nu', 'Quần dài, quần shorts nữ', 'square', 12, FALSE, TRUE),
-- Áo Khoác
('Áo Khoác Nam', 'ao-khoac-nam', 'Áo khoác nam các loại', 'cloud', 13, FALSE, TRUE),
('Áo Khoác Nữ', 'ao-khoac-nu', 'Áo khoác nữ các loại', 'cloud', 14, FALSE, TRUE),
-- Phụ Kiện
('Túi Xách', 'tui-xach', 'Túi xách nam nữ', 'shopping-bag', 15, TRUE, TRUE),
('Thắt Lưng', 'that-lung', 'Thắt lưng nam', 'link', 16, FALSE, TRUE),
('Khăn Choàng', 'khan-choang', 'Khăn choàng các loại', 'wind', 17, FALSE, TRUE),
('Mũ Nón', 'mu-non', 'Mũ nón các loại', 'circle', 18, FALSE, TRUE),
-- Set đồ
('Set Đồ Nam', 'set-do-nam', 'Bộ đồ nam', 'users', 19, FALSE, TRUE),
('Set Đồ Nữ', 'set-do-nu', 'Bộ đồ nữ', 'users', 20, FALSE, TRUE),
-- Trẻ Em
('Áo Trẻ Em', 'ao-tre-em', 'Áo trẻ em các loại', 'tshirt', 21, TRUE, TRUE),
('Quần Trẻ Em', 'quan-tre-em', 'Quần trẻ em các loại', 'square', 22, TRUE, TRUE),
('Váy Trẻ Em', 'vay-tre-em', 'Váy trẻ em các loại', 'triangle', 23, FALSE, TRUE),
('Đầm Trẻ Em', 'dam-tre-em', 'Đầm trẻ em các loại', 'heart', 24, TRUE, TRUE),
('Bộ Đồ Trẻ Em', 'bo-do-tre-em', 'Bộ đồ trẻ em', 'users', 25, FALSE, TRUE);

-- =====================================================
-- Seed: Brands
-- =====================================================
INSERT INTO brands (name, slug, logo, description, website, country, is_featured, is_active) VALUES
('UrbanStyle', 'urbanstyle', NULL, 'Thời trang đường phố năng động', 'https://urbanstyle.vn', 'Việt Nam', TRUE, TRUE),
('Elegance Pro', 'elegance-pro', NULL, 'Thời trang công sở cao cấp', 'https://elegancepro.vn', 'Việt Nam', TRUE, TRUE),
('KStyle VN', 'kstyle-vn', NULL, 'Phong cách Hàn Quốc', 'https://kstylevn.com', 'Việt Nam', TRUE, TRUE),
('BasicWear', 'basicwear', NULL, 'Đồ basic chất lượng cao', 'https://basicwear.vn', 'Việt Nam', FALSE, TRUE),
('SportyFit', 'sportyfit', NULL, 'Thời trang thể thao', 'https://sportyfit.vn', 'Việt Nam', FALSE, TRUE),
('Gentleman Club', 'gentleman-club', NULL, 'Thời trang nam giới cao cấp', 'https://gentlemanclub.vn', 'Việt Nam', FALSE, TRUE);

-- =====================================================
-- Seed: Sizes
-- =====================================================
INSERT INTO sizes (name, code, group_name, sort_order, is_active) VALUES
-- Size quần áo
('XS', 'XS', 'Áo', 1, TRUE),
('S', 'S', 'Áo', 2, TRUE),
('M', 'M', 'Áo', 3, TRUE),
('L', 'L', 'Áo', 4, TRUE),
('XL', 'XL', 'Áo', 5, TRUE),
('XXL', 'XXL', 'Áo', 6, TRUE),
('3XL', '3XL', 'Áo', 7, TRUE),
-- Size quần (số)
('26', '26', 'Quần', 8, TRUE),
('27', '27', 'Quần', 9, TRUE),
('28', '28', 'Quần', 10, TRUE),
('29', '29', 'Quần', 11, TRUE),
('30', '30', 'Quần', 12, TRUE),
('31', '31', 'Quần', 13, TRUE),
('32', '32', 'Quần', 14, TRUE),
('33', '33', 'Quần', 15, TRUE),
('34', '34', 'Quần', 16, TRUE),
-- Size giày
('38', '38', 'Giày', 17, TRUE),
('39', '39', 'Giày', 18, TRUE),
('40', '40', 'Giày', 19, TRUE),
('41', '41', 'Giày', 20, TRUE),
('42', '42', 'Giày', 21, TRUE),
('43', '43', 'Giày', 22, TRUE),
-- Thắt lưng
('75cm', '75', 'Thắt lưng', 23, TRUE),
('80cm', '80', 'Thắt lưng', 24, TRUE),
('85cm', '85', 'Thắt lưng', 25, TRUE),
('90cm', '90', 'Thắt lưng', 26, TRUE),
('95cm', '95', 'Thắt lưng', 27, TRUE),
-- Size trẻ em
('3-4T', '3-4T', 'Trẻ em', 28, TRUE),
('5-6T', '5-6T', 'Trẻ em', 29, TRUE),
('7-8T', '7-8T', 'Trẻ em', 30, TRUE),
('8-9T', '8-9T', 'Trẻ em', 31, TRUE);

-- =====================================================
-- Seed: Colors
-- =====================================================
INSERT INTO colors (name, code, hex_code, sort_order, is_active) VALUES
('Đen', 'DEN', '#000000', 1, TRUE),
('Trắng', 'TRA', '#FFFFFF', 2, TRUE),
('Xám', 'XAM', '#808080', 3, TRUE),
('Xanh Navy', 'NAV', '#000080', 4, TRUE),
('Xanh Dương', 'XDU', '#4169E1', 5, TRUE),
('Xanh Cây', 'XCA', '#228B22', 6, TRUE),
('Đỏ', 'DO', '#DC143C', 7, TRUE),
('Hồng', 'HONG', '#FF69B4', 8, TRUE),
('Hồng Phấn', 'HPHAN', '#FFD1DC', 9, TRUE),
('Cam', 'CAM', '#FFA500', 10, TRUE),
('Vàng', 'VANG', '#FFD700', 11, TRUE),
('Kem', 'KEM', '#FFFDD0', 12, TRUE),
('Be', 'BE', '#F5F5DC', 13, TRUE),
('Nâu', 'NAU', '#8B4513', 14, TRUE),
('Tím', 'TIM', '#800080', 15, TRUE),
('Xanh Mint', 'MINT', '#98FF98', 16, TRUE),
('Đen Trắng', 'DENTRA', '#000000', 17, TRUE),
('Xanh Nhạt', 'XNH', '#ADD8E6', 18, TRUE),
('Xanh Rêu', 'XREU', '#4A5D23', 19, TRUE),
('Họa Tiết', 'HT', '#CCCCCC', 20, TRUE);

-- =====================================================
-- Seed: Products
-- NOTE: Product images are stored in product_images table, NOT in products.image_url
-- =====================================================
INSERT INTO products (name, slug, short_description, description, price, compare_price, cost_price, sku, barcode, stock, low_stock_threshold, category_id, brand_id, gender, age_group, material, pattern, season, total_sold, is_featured, is_active) VALUES

-- Áo Thun Nam
('Áo Thun Nam Basic Cotton 100%', 'ao-thun-nam-basic-cotton', 'Áo thun nam cotton 100%, form regular thoáng mát', 'Áo thun nam chất liệu cotton 100% cao cấp, mềm mại và thoáng mát. Form regular phù hợp với nhiều dáng người. Thiết kế đơn giản dễ phối hợp với mọi trang phục. Đường may tỉ mỉ, bền đẹp theo thời gian.', 299000, 350000, 150000, 'ATN-BASIC-001', '8934567890001', 150, 5, 1, 4, 'male', 'adult', '100% Cotton', 'Trơn', 'Four Seasons', 320, TRUE, TRUE),
('Áo Thun Nam Oversize Graphic', 'ao-thun-nam-oversize-graphic', 'Áo thun oversize nam in họa tiết trendy 2026', 'Áo thun nam phong cách oversize, rộng rãi và thoải mái. Họa tiết in hình trendy, hiện đại theo xu hướng 2026. Chất liệu cotton blended mềm mại, không phai màu. Form baggy phù hợp với giới trẻ năng động.', 449000, 520000, 220000, 'ATN-OVER-001', '8934567890002', 90, 5, 1, 1, 'male', 'adult', 'Cotton Blend', 'Họa tiết', 'Four Seasons', 280, TRUE, TRUE),
('Áo Thun Nam Minimalist', 'ao-thun-nam-minimalist', 'Áo thun nam tối giản minimalist, dễ phối', 'Áo thun nam thiết kế tối giản theo phong cách minimalist. Không họa tiết, không logo, chỉ màu cơ bản. Chất cotton 280gsm dày dặn, form vừa vặn. Lý tưởng cho những ai yêu thích sự đơn giản.', 399000, NULL, 190000, 'ATN-MINI-001', '8934567890003', 80, 5, 1, 4, 'male', 'adult', '100% Cotton 280gsm', 'Trơn', 'Four Seasons', 150, FALSE, TRUE),

-- Áo Sơ Mi Nam
('Áo Sơ Mi Nam Oxford Cổ Trụ', 'ao-so-mi-nam-oxford-co-tru', 'Áo sơ mi oxford cổ trụ lịch lãm', 'Áo sơ mi nam chất liệu vải oxford cao cấp, mềm mại và thoáng khí. Cổ trụ (spread collar) lịch sự, form slim fit ôm vừa vặn. Phù hợp mặc đi làm, đi chơi hoặc các dịp quan trọng.', 559000, 680000, 280000, 'ASM-OXFORD-001', '8934567890010', 70, 5, 2, 2, 'male', 'adult', 'Vải Oxford', 'Trơn', 'Four Seasons', 195, TRUE, TRUE),
('Áo Sơ Mi Nam Hàn Quốc', 'ao-so-mi-nam-han-quoc', 'Áo sơ mi nam phong cách Hàn Quốc oversize', 'Áo sơ mi nam phong cách Hàn Quốc (K-fashion), form oversize thoải mái. Chất liệu vải mềm mại, thoáng khí. Có thể mặc đơn giản hoặc phối layers. Phù hợp cho mùa xuân, hè.', 429000, 500000, 210000, 'ASM-KOREAN-001', '8934567890011', 95, 5, 2, 3, 'male', 'adult', 'Vải TC', 'Trơn', 'Spring', 120, FALSE, TRUE),

-- Áo Polo Nam
('Áo Polo Nam Premium Pique', 'ao-polo-nam-premium-pique', 'Áo polo nam pique cotton cao cấp', 'Áo polo nam chất liệu pique cotton cao cấp, mang lại cảm giác thoáng mát suốt ngày dài. Thiết kế cổ polo trẻ trung và năng động. Đường may laser hiện đại, form regular vừa vặn.', 499000, NULL, 250000, 'APO-PREMIUM-001', '8934567890020', 100, 5, 3, 5, 'male', 'adult', 'Pique Cotton', 'Trơn', 'Summer', 180, FALSE, TRUE),

-- Quần Jeans Nam
('Quần Jeans Nam Slim Fit Wash Nhẹ', 'quan-jeans-nam-slim-fit', 'Quần jeans nam slim fit wash vintage nhẹ', 'Quần jeans nam slim fit chất liệu denim co giãn thoải mái. Wash nhẹ vintage look đẹp mắt. 5 túi tiện dụng. Phù hợp mặc hàng ngày, đi chơi hay đi làm đều phong cách.', 699000, 850000, 350000, 'QJN-SLIM-001', '8934567890030', 110, 5, 4, 6, 'male', 'adult', 'Denim Co Giãn', 'Trơn', 'Four Seasons', 410, TRUE, TRUE),
('Quần Jeans Nam Wide Leg', 'quan-jeans-nam-wide-leg', 'Quần jeans nam wide leg retro trend', 'Quần jeans nam wide leg phong cách retro trending. Chất liệu denim mềm mại, không cứng. Thiết kế dáng xuông wide leg rộng rãi, thoải mái. High waist giúp tôn eo.', 749000, 900000, 380000, 'QJN-WIDE-001', '8934567890031', 85, 5, 4, 1, 'male', 'adult', 'Denim', 'Trơn', 'Four Seasons', 290, TRUE, TRUE),

-- Quần Tây Nam
('Quần Tây Nam Slim Fit', 'quan-tay-nam-slim-fit', 'Quần âu nam slim fit công sở', 'Quần tây nam form slim lịch lãm và chuyên nghiệp. Chất liệu vải wool blend mềm mại, thoáng khí, không nhăn. Thiết kế 2 nếp gấp trước sang trọng. Phù hợp đi làm công sở.', 899000, 1100000, 450000, 'QTN-SLIM-001', '8934567890040', 65, 5, 5, 2, 'male', 'adult', 'Wool Blend', 'Trơn', 'Four Seasons', 160, FALSE, TRUE),

-- Quần Short Nam
('Quần Short Nam Chino Beige', 'quan-short-nam-chino-beige', 'Quần short nam chino màu beige trendy', 'Quần short nam chino màu beige trendy, phong cách. Chất liệu cotton chino cao cấp, bền đẹp. Thiết kế 2 túi bên hông. Dáng quần vừa vặn, độ dài trên gối. Phù hợp mùa hè.', 449000, NULL, 220000, 'QSN-CHINO-001', '8934567890050', 95, 5, 6, 5, 'male', 'adult', 'Cotton Chino', 'Trơn', 'Summer', 230, TRUE, TRUE),

-- Áo Blouse Nữ
('Áo Blouse Nữ Lụa Cao Cấp', 'ao-blouse-nu-lua-cao-cap', 'Áo blouse nữ lụa mềm mại, sang trọng', 'Áo blouse nữ chất liệu lụa cao cấp, mềm mại và thoáng khí. Thiết kế cổ V thanh lịch, tay dài bo nhẹ. Phù hợp đi làm công sở hoặc đi chơi đều sang trọng.', 599000, 720000, 300000, 'ABN-LUA-001', '8934567890060', 75, 5, 7, 2, 'female', 'adult', 'Lụa', 'Trơn', 'Four Seasons', 350, TRUE, TRUE),
('Áo Blouse Nữ Voan Trắng', 'ao-blouse-nu-voan-trang', 'Áo blouse nữ voan trắng thanh lịch', 'Áo blouse nữ chất liệu voan mỏng nhẹ, thoáng mát. Màu trắng thanh lịch, dễ phối với mọi trang phục. Phù hợp công sở hoặc dạo phố. Đường may tỉ mỉ, không nhăn.', 449000, 550000, 220000, 'ABN-VOAN-001', '8934567890061', 90, 5, 7, 3, 'female', 'adult', 'Voan', 'Trơn', 'Summer', 210, FALSE, TRUE),

-- Áo Thun Nữ
('Áo Thun Nữ Basic Trơn', 'ao-thun-nu-basic-tron', 'Áo thun nữ basic cổ tròn trơn', 'Áo thun nữ basic cổ tròn thiết kế đơn giản, dễ phối. Chất cotton 95% co giãn tốt, thoáng mát. Form regular vừa vặn, phù hợp nhiều dáng người. Nhiều màu sắc lựa chọn.', 199000, 250000, 100000, 'ATN-BASIC-002', '8934567890070', 180, 5, 8, 4, 'female', 'adult', 'Cotton 95%', 'Trơn', 'Four Seasons', 520, TRUE, TRUE),
('Áo Thun Nữ Tay Lửng Oversize', 'ao-thun-nu-tay-luu-oversize', 'Áo thun nữ tay lửng oversize streetwear', 'Áo thun nữ tay lửng phong cách streetwear, trẻ trung và cá tính. Form oversize rộng rãi, thoải mái. Chất cotton blend mềm mại. Kết hợp với chân váy ngắn, quần jeans đều đẹp.', 279000, NULL, 140000, 'ATN-OVER-002', '8934567890071', 120, 5, 8, 1, 'female', 'adult', 'Cotton Blend', 'Trơn', 'Four Seasons', 380, FALSE, TRUE),

-- Áo Croptop
('Áo Croptop Nữ Thun Co Giãn', 'ao-croptop-nu-thun', 'Áo croptop nữ thun co giãn 4 chiều', 'Áo croptop nữ chất thun cotton co giãn 4 chiều, thoáng mát. Thiết kế croptop vừa vặn, tôn dáng. Phong cách trẻ trung, năng động. Kết hợp hoàn hảo với quần jeans cao, chân váy.', 199000, NULL, 95000, 'ACT-CROP-001', '8934567890080', 200, 5, 9, 1, 'female', 'adult', 'Thun Cotton', 'Trơn', 'Summer', 460, TRUE, TRUE),

-- Chân Váy
('Chân Váy Midi Xếp Ly', 'chan-vay-midi-xep-ly', 'Chân váy midi xếp ly thanh lịch', 'Chân váy midi xếp ly thiết kế thanh lịch và sang trọng. Chất liệu voan nhún nhẹ nhàng, bay bổng. Dáng váy xếp ly đều đẹp, che khuyết điểm chân. Phù hợp đi làm, đi chơi hay dự tiệc.', 399000, 480000, 200000, 'CVM-XEP-001', '8934567890090', 80, 5, 10, 2, 'female', 'adult', 'Voan Nhún', 'Trơn', 'Four Seasons', 310, TRUE, TRUE),
('Chân Váy Tennis Caro', 'chan-vay-tennis-caro', 'Chân váy tennis caro xinh xắn', 'Chân váy tennis chất liệu vải bông thoáng mát. Họa tiết caro trendy. Dáng ngắn trên gối, năng động. Phù hợp mặc đi chơi, dạo phố, picnic.', 299000, NULL, 150000, 'CVM-CARO-001', '8934567890091', 100, 5, 10, 4, 'female', 'adult', 'Cotton Caro', 'Caro', 'Summer', 195, FALSE, TRUE),

-- Đầm Nữ
('Đầm Midi Ôm Body Sexy', 'dam-midi-ong-body', 'Đầm midi ôm body sexy quyến rũ', 'Đầm midi ôm body thiết kế sexy và quyến rũ. Chất liệu thun co giãn ôm vừa, tôn dáng. Cổ V thanh lịch. Chiều dài midi phía trên gối vừa đủ. Phù hợp đi tiệc, đi chơi hoặc date.', 699000, 850000, 350000, 'DMN-BODY-001', '8934567890100', 60, 5, 11, 1, 'female', 'adult', 'Thun Co Giãn', 'Trơn', 'Four Seasons', 380, TRUE, TRUE),
('Đầm Xòe Mini Hoa Nhí', 'dam-xoe-mini-hoa-nhi', 'Đầm xòe mini hoa nhí xinh xắn', 'Đầm xòe mini hoa nhí thiết kế xinh xắn, trẻ trung. Chất liệu voan chiffon nhẹ nhàng, bay bổng. Phần thân trên ôm nhẹ, chân váy xòe. Phù hợp đi chơi, dạo phố, picnic hay cafe.', 499000, NULL, 250000, 'DMN-XOE-001', '8934567890101', 75, 5, 11, 3, 'female', 'adult', 'Chiffon', 'Hoa', 'Spring', 240, FALSE, TRUE),
('Đầm Suông Dài Basic Đen', 'dam-suong-dai-basic', 'Đầm suông dài basic đen đơn giản', 'Đầm suông dài basic màu đen đơn giản nhưng không nhàm chán. Chất liệu thun modal mềm mại, thoáng khí. Thiết kế suông rộng rãi, thoải mái mọi dáng người. Cổ tròn đơn giản, tay dài.', 349000, NULL, 175000, 'DMN-SUONG-001', '8934567890102', 120, 5, 11, 4, 'female', 'adult', 'Modal', 'Trơn', 'Four Seasons', 180, FALSE, TRUE),

-- Quần Nữ
('Quần Jeans Nữ Wide Leg', 'quan-jeans-nu-wide-leg', 'Quần jeans nữ wide leg retro', 'Quần jeans nữ wide leg phong cách retro trending. Chất liệu denim mềm mại, không cứng. Thiết kế dáng xuông wide leg rộng rãi, thoải mái. High waist giúp tôn eo và che khuyết điểm.', 649000, 780000, 325000, 'QJN-WIDE-002', '8934567890110', 90, 5, 12, 1, 'female', 'adult', 'Denim', 'Trơn', 'Four Seasons', 330, TRUE, TRUE),
('Quần Dài Nữ Ống Suông', 'quan-dai-nu-ong-suong', 'Quần dài nữ ống suông linen', 'Quần dài nữ ống suông chất liệu linen thoáng mát. Thiết kế ống rộng suông, thoải mái cho mọi hoạt động. High waist có thắt lưng rời. Phù hợp mùa hè, đi biển, đi dạo phố.', 429000, 520000, 215000, 'QDN-SUONG-001', '8934567890111', 100, 5, 12, 3, 'female', 'adult', 'Linen', 'Trơn', 'Summer', 220, FALSE, TRUE),

-- Áo Khoác Nam
('Áo Khoác Gió Nam Nữ Unisex', 'ao-khoac-gio-nam-nu', 'Áo khoác gió chống nước unisex', 'Áo khoác gió nam nữ phong cách sporty, chống nước hiệu quả. Chất liệu vải dù cao cấp, nhẹ và bền. Nón có dây rút điều chỉnh. Nhiều túi tiện dụng. Form unisex.', 699000, 850000, 350000, 'AKG-GIO-001', '8934567890120', 85, 5, 13, 5, 'unisex', 'adult', 'Vải Dù', 'Trơn', 'Rainy', 480, TRUE, TRUE),
('Áo Blazer Nam Slim Fit', 'ao-blazer-nam-slim-fit', 'Áo blazer nam slim lịch lãm', 'Áo blazer nam slim fit thiết kế lịch lãm và sang trọng. Chất liệu vải wool blend cao cấp, không nhăn. Cổ blazer classic, 2 hàng cúc. Phù hợp đi làm, dự họp, đi tiệc.', 1299000, 1550000, 650000, 'ABL-SLIM-001', '8934567890121', 40, 5, 13, 2, 'male', 'adult', 'Wool Blend', 'Trơn', 'Four Seasons', 145, TRUE, TRUE),
('Áo Khoác Denim Nam Wash Nhẹ', 'ao-khoac-denim-nam', 'Áo khoác denim wash vintage', 'Áo khoác denim nam chất liệu jeans 100% cotton, bền đẹp. Wash nhẹ vintage look thời trang. Thiết kế classic với 4 túi, cúc kim loại. Form regular vừa vặn.', 899000, 1100000, 450000, 'AKD-DENIM-001', '8934567890122', 65, 5, 13, 6, 'male', 'adult', '100% Cotton Denim', 'Trơn', 'Four Seasons', 190, FALSE, TRUE),

-- Áo Khoác Nữ
('Áo Cardigan Nữ Len Mỏng', 'ao-cardigan-nu-len', 'Áo cardigan nữ len phong cách Hàn', 'Áo cardigan nữ len mỏng phong cách K-fashion Hàn Quốc. Chất liệu len acrylic nhẹ, ấm áp. Thiết kế mở phía trước, không cúc. Dáng rộng thoải mái, phối layers đẹp.', 549000, 680000, 275000, 'ACN-LEN-001', '8934567890130', 70, 5, 14, 3, 'female', 'adult', 'Len Acrylic', 'Dệt kim', 'Autumn', 260, TRUE, TRUE),

-- Túi Xách
('Túi Xách Nữ Đeo Chéo Minimal', 'tui-xach-nu-deo-cheo', 'Túi xách nữ minimal da PU', 'Túi xách nữ đeo chéo phong cách minimal, hiện đại. Chất liệu da PU cao cấp, bền đẹp. Kích thước vừa đủ cho điện thoại, ví, keys. Dây đeo có thể điều chỉnh độ dài.', 449000, 550000, 225000, 'TXN-MINI-001', '8934567890140', 90, 5, 15, 1, 'female', 'adult', 'Da PU', 'Trơn', 'Four Seasons', 270, TRUE, TRUE),
('Túi Xách Nam Đeo Chéo', 'tui-xach-nam-deo-cheo', 'Túi xách nam thể thao da', 'Túi xách nam đeo chéo phong cách thể thao, năng động. Chất liệu da tổng hợp bền, chống nước. Nhiều ngăn, đựng được laptop 14 inch. Phù hợp đi học, đi làm, du lịch.', 599000, 720000, 300000, 'TXN-SPORT-001', '8934567890141', 75, 5, 15, 5, 'male', 'adult', 'Da Tổng Hợp', 'Trơn', 'Four Seasons', 165, FALSE, TRUE),

-- Thắt Lưng
('Thắt Lưng Da Bò Nam Cao Cấp', 'that-lung-da-bo-nam', 'Thắt lưng da bò 100%', 'Thắt lưng da bò nam cao cấp, da thật 100%. Khóa kim loại sang trọng, chắc chắn. Chiều rộng 3.5cm phù hợp với mọi quần. Màu đen và nâu cổ điển. Phù hợp đi làm, đi tiệc.', 599000, 720000, 300000, 'TLD-BO-001', '8934567890150', 100, 5, 16, 6, 'male', 'adult', 'Da Bò', 'Trơn', 'Four Seasons', 130, FALSE, TRUE),

-- Khăn Choàng
('Khăn Choàng Nữ Lụa Cao Cấp', 'khan-choang-nu-lua', 'Khăn choàng lụa mềm mại', 'Khăn choàng nữ lụa cao cấp, mềm mại và sang trọng. Kích thước 180x70cm đa dụng. Có thể đeo nhiều kiểu: quấn cổ, choàng vai, buộc tóc. Màu pastel nhẹ nhàng.', 299000, NULL, 150000, 'KCN-LUA-001', '8934567890160', 150, 5, 17, 2, 'female', 'adult', 'Lụa', 'Trơn', 'Four Seasons', 95, FALSE, TRUE),

-- Mũ Nón
('Mũ Snapback Nam Unisex', 'mu-snapback-nam', 'Mũ snapback streetwear', 'Mũ snapback nam unisex phong cách streetwear, trẻ trung. Chất liệu vải nỉ bông cao cấp, form giữ shape đẹp. Logo broider tinh tế. Có thể điều chỉnh size.', 249000, 320000, 125000, 'MSN-SNAP-001', '8934567890170', 120, 5, 18, 1, 'unisex', 'adult', 'Nỉ Bông', 'Trơn', 'Four Seasons', 175, FALSE, TRUE),

-- Set Đồ Nam
('Bộ Đồ Thể Thao Nam 3 Món', 'bo-do-the-thao-nam-3-mon', 'Bộ đồ thể thao nam: áo + quần shorts + quần dài', 'Bộ đồ thể thao nam 3 món đầy đủ: áo thun thể thao, quần shorts và quần dài jogger. Chất liệu thun thể thao co giãn 4 chiều, thoáng khí. Bộ đồ tiện lợi.', 799000, 980000, 400000, 'BDT-3M-001', '8934567890180', 55, 5, 19, 5, 'male', 'adult', 'Thun Thể Thao', 'Trơn', 'Four Seasons', 120, TRUE, TRUE),

-- Set Đồ Nữ
('Set Váy + Áo Blouse Nữ', 'set-vay-ao-blouse-nu', 'Set chân váy + blouse nữ công sở', 'Set váy + áo blouse nữ bộ đôi phong cách công sở sang trọng. Áo blouse lụa cao cấp, chân váy midi xếp ly thanh lịch. Bộ đồ phối hợp hoàn hảo, tiện lợi.', 899000, 1100000, 450000, 'SVA-BL-001', '8934567890190', 45, 5, 20, 2, 'female', 'adult', 'Lụa + Voan', 'Trơn', 'Four Seasons', 88, TRUE, TRUE),

-- Áo Trẻ Em Bé Gái
('Áo Thun Trẻ Em Bé Gái Hoa', 'ao-thun-tre-em-be-gai-hoa', 'Áo thun trẻ em bé gái họa tiết hoa dễ thương', 'Áo thun trẻ em bé gái chất liệu cotton 100% mềm mại, thoáng mát. Họa tiết hoa in xinh xắn, trẻ trung. Form regular phù hợp bé gái 3-8 tuổi. Nhiều màu sắc tươi sáng.', 149000, 180000, 75000, 'ATT-BG-001', '8934567890200', 80, 5, 21, 4, 'female', 'kids', '100% Cotton', 'Hoa', 'Four Seasons', 195, TRUE, TRUE),
('Áo Thun Trẻ Em Bé Trai Cars', 'ao-thun-tre-em-be-trai-cars', 'Áo thun trẻ em bé trai in hình xe', 'Áo thun trẻ em bé trai phong cách, in hình xe hot trend. Chất cotton co giãn thoải mái cho bé vui chơi. Form regular vừa vặn. Phù hợp bé trai 4-10 tuổi.', 159000, 190000, 80000, 'ATT-BT-001', '8934567890201', 75, 5, 21, 1, 'male', 'kids', 'Cotton Co Giãn', 'Họa tiết', 'Four Seasons', 210, TRUE, TRUE),
('Áo Sơ Mi Trẻ Em Bé Gái Cổ Vuông', 'ao-so-mi-tre-em-be-gai', 'Áo sơ mi trẻ em bé gái cổ vuông xinh', 'Áo sơ mi trẻ em bé gái thiết kế cổ vuông thanh lịch. Chất vải mềm mại, không nhăn. Phù hợp đi học, đi chơi. Form regular thoải mái cho bé.', 199000, 250000, 100000, 'ASM-TE-BG-001', '8934567890202', 60, 5, 21, 2, 'female', 'kids', 'Vải Cotton', 'Trơn', 'Four Seasons', 145, FALSE, TRUE),

-- Quần Trẻ Em
('Quần Jeans Trẻ Em Bé Gái', 'quan-jeans-tre-em-be-gai', 'Quần jeans trẻ em bé gái xinh xắn', 'Quần jeans trẻ em bé gái chất liệu denim mềm, co giãn nhẹ. Wash nhẹ vintage đẹp mắt. Thiết kế 2 túi. Phù hợp bé gái 3-10 tuổi mặc hàng ngày.', 249000, 300000, 125000, 'QJT-BG-001', '8934567890210', 65, 5, 22, 6, 'female', 'kids', 'Denim Mềm', 'Trơn', 'Four Seasons', 175, TRUE, TRUE),
('Quần Short Trẻ Em Bé Trai', 'quan-short-tre-em-be-trai', 'Quần shorts trẻ em bé trai thể thao', 'Quần shorts trẻ em bé trai phong cách thể thao, năng động. Chất thun co giãn thoải mái. Cạp chun co giãn, dễ mặc. Phù hợp bé trai 4-12 tuổi mùa hè.', 179000, NULL, 90000, 'QST-BT-001', '8934567890211', 70, 5, 22, 5, 'male', 'kids', 'Thun Co Giãn', 'Trơn', 'Summer', 190, TRUE, TRUE),
('Quần Dài Trẻ Em Cạp Chun', 'quan-dai-tre-em-cach-chun', 'Quần dài trẻ em cạp chun thoải mái', 'Quần dài trẻ em unisex cạp chun co giãn thoải mái. Chất vải cotton thoáng mát, dễ giặt. Thiết kế đơn giản, dễ phối. Phù hợp mọi hoàn cảnh.', 199000, 240000, 100000, 'QDT-CACH-001', '8934567890212', 85, 5, 22, 4, 'unisex', 'kids', 'Cotton', 'Trơn', 'Four Seasons', 155, FALSE, TRUE),

-- Váy Trẻ Em
('Váy Xếp Ly Trẻ Em Bé Gái', 'vay-xep-ly-tre-em', 'Váy xếp ly trẻ em bé gái dễ thương', 'Váy xếp ly trẻ em bé gái thiết kế xinh xắn, bồng bềnh. Chất voan nhẹ nhàng, bay bổng. Phù hợp bé gái 3-8 tuổi đi chơi, đi tiệc. Nhiều màu pastel dễ thương.', 229000, 280000, 115000, 'VXL-TE-001', '8934567890220', 55, 5, 23, 3, 'female', 'kids', 'Voan', 'Xếp ly', 'Four Seasons', 165, TRUE, TRUE),

-- Đầm Trẻ Em
('Đầm Xòe Trẻ Em Bé Gái', 'dam-xoe-tre-em', 'Đầm xòe trẻ em bé gái yêu', 'Đầm xòe trẻ em bé gái thiết kế bồng bềnh, yêu yêu. Chất vải mềm mại, thoáng mát. Cổ tròn bo nhẹ. Phù hợp bé gái 3-10 tuổi đi chơi, sinh nhật, đi tiệc.', 299000, 360000, 150000, 'DXL-TE-001', '8934567890230', 45, 5, 24, 3, 'female', 'kids', 'Voan Mềm', 'Xòe', 'Four Seasons', 180, TRUE, TRUE),
('Đầm Thun Trẻ Em Bé Gái', 'dam-thun-tre-em', 'Đầm thun trẻ em bé gái basic', 'Đầm thun trẻ em bé gái form A-line đơn giản. Chất thun cotton co giãn, thoải mái cho bé vui chơi. Cổ tròn dễ mặc. Phù hợp mặc nhà, đi chơi.', 199000, NULL, 100000, 'DTT-TE-001', '8934567890231', 60, 5, 24, 4, 'female', 'kids', 'Thun Cotton', 'Trơn', 'Four Seasons', 135, FALSE, TRUE),

-- Bộ Đồ Trẻ Em
('Bộ Đồ Thun Trẻ Em Bé Gái', 'bo-do-thun-tre-em-be-gai', 'Bộ đồ thun trẻ em bé gái xinh', 'Bộ đồ trẻ em bé gái gồm áo thun + chân váy. Chất thun cotton mềm mại, thoáng mát. Thiết kế phối màu xinh xắn. Phù hợp bé gái 3-7 tuổi mặc nhà, đi chơi.', 349000, 420000, 175000, 'BDT-BG-001', '8934567890240', 40, 5, 25, 4, 'female', 'kids', 'Thun Cotton', 'Trơn', 'Four Seasons', 120, TRUE, TRUE),
('Bộ Đồ Thể Thao Trẻ Em Bé Trai', 'bo-do-the-thao-tre-em', 'Bộ đồ thể thao trẻ em bé trai', 'Bộ đồ thể thao trẻ em bé trai gồm áo thun + quần shorts. Chất thun co giãn 4 chiều, thoáng khí. Thiết kế sporty năng động. Phù hợp bé trai 4-12 tuổi vui chơi.', 299000, 360000, 150000, 'BDTT-BT-001', '8934567890241', 50, 5, 25, 5, 'male', 'kids', 'Thun Thể Thao', 'Trơn', 'Summer', 98, FALSE, TRUE);

-- =====================================================
-- Seed: Product Images
-- NOTE: All images stored here, NOT in products.image_url
-- =====================================================
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary, is_thumbnail) VALUES
-- Áo Thun Nam Basic (1)
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'Áo Thun Nam Basic Đen', 1, TRUE, TRUE),
(1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop', 'Áo Thun Nam Basic Trắng', 2, FALSE, FALSE),
(1, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop', 'Áo Thun Nam Basic Xám', 3, FALSE, FALSE),
-- Áo Thun Nam Oversize (2)
(2, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop', 'Áo Thun Oversize Graphic', 1, TRUE, TRUE),
(2, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', 'Áo Thun Oversize Trắng', 2, FALSE, FALSE),
-- Áo Thun Nam Minimalist (3)
(3, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop', 'Áo Thun Minimalist Đen', 1, TRUE, TRUE),
-- Áo Sơ Mi Nam Oxford (4)
(4, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop', 'Áo Sơ Mi Oxford Trắng', 1, TRUE, TRUE),
(4, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&h=800&fit=crop', 'Áo Sơ Mi Oxford Xanh', 2, FALSE, FALSE),
-- Áo Sơ Mi Nam Hàn (5)
(5, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&h=800&fit=crop', 'Áo Sơ Mi Hàn Quốc', 1, TRUE, TRUE),
-- Áo Polo Nam (6)
(6, 'https://images.unsplash.com/photo-1625910513413-5fc4e5e40687?w=800&h=800&fit=crop', 'Áo Polo Premium Đỏ', 1, TRUE, TRUE),
-- Quần Jeans Slim (7)
(7, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', 'Quần Jeans Slim Fit', 1, TRUE, TRUE),
-- Quần Jeans Wide Leg Nam (8)
(8, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', 'Quần Jeans Wide Leg', 1, TRUE, TRUE),
-- Quần Tây Nam (9)
(9, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop', 'Quần Tây Slim', 1, TRUE, TRUE),
-- Quần Short Nam (10)
(10, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop', 'Quần Short Chino', 1, TRUE, TRUE),
-- Áo Blouse Nữ Lụa (11)
(11, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop', 'Áo Blouse Lụa Trắng', 1, TRUE, TRUE),
(11, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop', 'Áo Blouse Lụa Hồng', 2, FALSE, FALSE),
-- Áo Blouse Voan (12)
(12, 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=800&fit=crop', 'Áo Blouse Voan', 1, TRUE, TRUE),
-- Áo Thun Nữ Basic (13)
(13, 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&h=800&fit=crop', 'Áo Thun Nữ Basic', 1, TRUE, TRUE),
-- Áo Thun Nữ Tay Lửng (14)
(14, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop', 'Áo Thun Nữ Tay Lửng', 1, TRUE, TRUE),
-- Áo Croptop (15)
(15, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=800&fit=crop', 'Áo Croptop', 1, TRUE, TRUE),
-- Chân Váy Midi (16)
(16, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=800&fit=crop', 'Chân Váy Midi Xếp Ly', 1, TRUE, TRUE),
-- Chân Váy Caro (17)
(17, 'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=800&h=800&fit=crop', 'Chân Váy Caro', 1, TRUE, TRUE),
-- Đầm Midi Body (18)
(18, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop', 'Đầm Midi Body Đen', 1, TRUE, TRUE),
-- Đầm Xòe (19)
(19, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop', 'Đầm Xòe Mini', 1, TRUE, TRUE),
-- Đầm Suông (20)
(20, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=800&fit=crop', 'Đầm Suông Đen', 1, TRUE, TRUE),
-- Quần Jeans Wide Leg Nữ (21)
(21, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=800&fit=crop', 'Quần Jeans Wide Leg', 1, TRUE, TRUE),
-- Quần Dài Suông (22)
(22, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=800&fit=crop', 'Quần Dài Suông', 1, TRUE, TRUE),
-- Áo Khoác Gió (23)
(23, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop', 'Áo Khoác Gió Đen', 1, TRUE, TRUE),
(23, 'https://images.unsplash.com/photo-1544928716-9ef0b4c4f2b8?w=800&h=800&fit=crop', 'Áo Khoác Gió Xanh', 2, FALSE, FALSE),
-- Áo Blazer Nam (24)
(24, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop', 'Áo Blazer Slim', 1, TRUE, TRUE),
-- Áo Khoác Denim (25)
(25, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop', 'Áo Khoác Denim', 1, TRUE, TRUE),
-- Áo Cardigan Nữ (26)
(26, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop', 'Áo Cardigan Len', 1, TRUE, TRUE),
-- Túi Xách Nữ (27)
(27, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop', 'Túi Xách Minimal', 1, TRUE, TRUE),
-- Túi Xách Nam (28)
(28, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', 'Túi Xách Thể Thao', 1, TRUE, TRUE),
-- Thắt Lưng (29)
(29, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&h=800&fit=crop', 'Thắt Lưng Da Bò', 1, TRUE, TRUE),
-- Khăn Choàng (30)
(30, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop', 'Khăn Choàng Lụa', 1, TRUE, TRUE),
-- Mũ Snapback (31)
(31, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop', 'Mũ Snapback', 1, TRUE, TRUE),
-- Bộ Đồ Thể Thao Nam (32)
(32, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop', 'Bộ Đồ Thể Thao', 1, TRUE, TRUE),
-- Set Váy Blouse (33)
(33, 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&h=800&fit=crop', 'Set Váy Blouse', 1, TRUE, TRUE),
-- Áo Thun Trẻ Em Bé Gái Hoa (34)
(34, 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=800&h=800&fit=crop', 'Áo Thun Trẻ Em Bé Gái Hoa Hồng', 1, TRUE, TRUE),
(34, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=800&fit=crop', 'Áo Thun Trẻ Em Bé Gái Hoa Trắng', 2, FALSE, FALSE),
-- Áo Thun Trẻ Em Bé Trai Cars (35)
(35, 'https://images.unsplash.com/photo-1617609180892-e5f3b73d3dc4?w=800&h=800&fit=crop', 'Áo Thun Trẻ Em Bé Trai Cars Xanh', 1, TRUE, TRUE),
(35, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=800&fit=crop', 'Áo Thun Trẻ Em Bé Trai Cars Đỏ', 2, FALSE, FALSE),
-- Áo Sơ Mi Trẻ Em Bé Gái (36)
(36, 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=800&h=800&fit=crop', 'Áo Sơ Mi Trẻ Em Bé Gái Hồng', 1, TRUE, TRUE),
-- Quần Jeans Trẻ Em Bé Gái (37)
(37, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', 'Quần Jeans Trẻ Em Bé Gái', 1, TRUE, TRUE),
-- Quần Short Trẻ Em Bé Trai (38)
(38, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=800&fit=crop', 'Quần Short Trẻ Em Bé Trai', 1, TRUE, TRUE),
-- Quần Dài Trẻ Em Cạp Chun (39)
(39, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=800&fit=crop', 'Quần Dài Trẻ Em', 1, TRUE, TRUE),
-- Váy Xếp Ly Trẻ Em (40)
(40, 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=800&h=800&fit=crop', 'Váy Xếp Ly Trẻ Em Bé Gái', 1, TRUE, TRUE),
-- Đầm Xòe Trẻ Em (41)
(41, 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=800&h=800&fit=crop', 'Đầm Xòe Trẻ Em Bé Gái', 1, TRUE, TRUE),
-- Đầm Thun Trẻ Em (42)
(42, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=800&fit=crop', 'Đầm Thun Trẻ Em', 1, TRUE, TRUE),
-- Bộ Đồ Thun Trẻ Em Bé Gái (43)
(43, 'https://images.unsplash.com/photo-1518831959646-742c15d9fb95?w=800&h=800&fit=crop', 'Bộ Đồ Thun Trẻ Em Bé Gái', 1, TRUE, TRUE),
-- Bộ Đồ Thể Thao Trẻ Em Bé Trai (44)
(44, 'https://images.unsplash.com/photo-1617609180892-e5f3b73d3dc4?w=800&h=800&fit=crop', 'Bộ Đồ Thể Thao Trẻ Em Bé Trai', 1, TRUE, TRUE);

-- =====================================================
-- Seed: Product Variants
-- =====================================================
-- Áo Thun Nam Basic (product_id=1) - sizes: S(2),M(3),L(4),XL(5) - colors: Đen(1), Trắng(2), Xám(3)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(1, 2, 1, 'ATN-BC-S-DEN', '8934567890001-S-DEN', 299000, 150000, 35, TRUE),
(1, 3, 1, 'ATN-BC-M-DEN', '8934567890001-M-DEN', 299000, 150000, 40, TRUE),
(1, 4, 1, 'ATN-BC-L-DEN', '8934567890001-L-DEN', 299000, 150000, 35, TRUE),
(1, 5, 1, 'ATN-BC-XL-DEN', '8934567890001-XL-DEN', 299000, 150000, 20, TRUE),
(1, 2, 2, 'ATN-BC-S-TRA', '8934567890001-S-TRA', 299000, 150000, 30, TRUE),
(1, 3, 2, 'ATN-BC-M-TRA', '8934567890001-M-TRA', 299000, 150000, 40, TRUE),
(1, 4, 2, 'ATN-BC-L-TRA', '8934567890001-L-TRA', 299000, 150000, 30, TRUE),
(1, 5, 2, 'ATN-BC-XL-TRA', '8934567890001-XL-TRA', 299000, 150000, 25, TRUE),
(1, 2, 3, 'ATN-BC-S-XAM', '8934567890001-S-XAM', 299000, 150000, 20, TRUE),
(1, 3, 3, 'ATN-BC-M-XAM', '8934567890001-M-XAM', 299000, 150000, 25, TRUE),
(1, 4, 3, 'ATN-BC-L-XAM', '8934567890001-L-XAM', 299000, 150000, 20, TRUE),
(1, 5, 3, 'ATN-BC-XL-XAM', '8934567890001-XL-XAM', 299000, 150000, 15, TRUE);

-- Áo Thun Nam Oversize (product_id=2) - sizes: S,M,L,XL - colors: Đen, Trắng
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(2, 2, 1, 'ATN-OV-S-DEN', '8934567890002-S-DEN', 449000, 220000, 25, TRUE),
(2, 3, 1, 'ATN-OV-M-DEN', '8934567890002-M-DEN', 449000, 220000, 30, TRUE),
(2, 4, 1, 'ATN-OV-L-DEN', '8934567890002-L-DEN', 449000, 220000, 25, TRUE),
(2, 5, 1, 'ATN-OV-XL-DEN', '8934567890002-XL-DEN', 449000, 220000, 15, TRUE),
(2, 2, 2, 'ATN-OV-S-TRA', '8934567890002-S-TRA', 449000, 220000, 20, TRUE),
(2, 3, 2, 'ATN-OV-M-TRA', '8934567890002-M-TRA', 449000, 220000, 25, TRUE),
(2, 4, 2, 'ATN-OV-L-TRA', '8934567890002-L-TRA', 449000, 220000, 20, TRUE),
(2, 5, 2, 'ATN-OV-XL-TRA', '8934567890002-XL-TRA', 449000, 220000, 10, TRUE);

-- Áo Thun Nữ Basic (product_id=13) - sizes: XS,S,M,L - colors: Đen, Trắng, Hồng
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(13, 1, 1, 'ATN-F-XS-DEN', '8934567890070-XS-DEN', 199000, 100000, 40, TRUE),
(13, 2, 1, 'ATN-F-S-DEN', '8934567890070-S-DEN', 199000, 100000, 50, TRUE),
(13, 3, 1, 'ATN-F-M-DEN', '8934567890070-M-DEN', 199000, 100000, 55, TRUE),
(13, 4, 1, 'ATN-F-L-DEN', '8934567890070-L-DEN', 199000, 100000, 35, TRUE),
(13, 1, 2, 'ATN-F-XS-TRA', '8934567890070-XS-TRA', 199000, 100000, 35, TRUE),
(13, 2, 2, 'ATN-F-S-TRA', '8934567890070-S-TRA', 199000, 100000, 45, TRUE),
(13, 3, 2, 'ATN-F-M-TRA', '8934567890070-M-TRA', 199000, 100000, 50, TRUE),
(13, 4, 2, 'ATN-F-L-TRA', '8934567890070-L-TRA', 199000, 100000, 30, TRUE),
(13, 1, 8, 'ATN-F-XS-HONG', '8934567890070-XS-HONG', 199000, 100000, 30, TRUE),
(13, 2, 8, 'ATN-F-S-HONG', '8934567890070-S-HONG', 199000, 100000, 40, TRUE),
(13, 3, 8, 'ATN-F-M-HONG', '8934567890070-M-HONG', 199000, 100000, 45, TRUE),
(13, 4, 8, 'ATN-F-L-HONG', '8934567890070-L-HONG', 199000, 100000, 25, TRUE);

-- Áo Croptop (product_id=15) - sizes: XS,S,M,L - colors: Đen, Trắng, Hồng
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(15, 1, 1, 'ACT-CR-XS-DEN', '8934567890080-XS-DEN', 199000, 95000, 50, TRUE),
(15, 2, 1, 'ACT-CR-S-DEN', '8934567890080-S-DEN', 199000, 95000, 60, TRUE),
(15, 3, 1, 'ACT-CR-M-DEN', '8934567890080-M-DEN', 199000, 95000, 65, TRUE),
(15, 4, 1, 'ACT-CR-L-DEN', '8934567890080-L-DEN', 199000, 95000, 40, TRUE),
(15, 1, 2, 'ACT-CR-XS-TRA', '8934567890080-XS-TRA', 199000, 95000, 40, TRUE),
(15, 2, 2, 'ACT-CR-S-TRA', '8934567890080-S-TRA', 199000, 95000, 50, TRUE),
(15, 3, 2, 'ACT-CR-M-TRA', '8934567890080-M-TRA', 199000, 95000, 55, TRUE),
(15, 4, 2, 'ACT-CR-L-TRA', '8934567890080-L-TRA', 199000, 95000, 30, TRUE),
(15, 1, 8, 'ACT-CR-XS-HONG', '8934567890080-XS-HONG', 199000, 95000, 35, TRUE),
(15, 2, 8, 'ACT-CR-S-HONG', '8934567890080-S-HONG', 199000, 95000, 45, TRUE),
(15, 3, 8, 'ACT-CR-M-HONG', '8934567890080-M-HONG', 199000, 95000, 50, TRUE),
(15, 4, 8, 'ACT-CR-L-HONG', '8934567890080-L-HONG', 199000, 95000, 25, TRUE);

-- Quần Jeans Slim (product_id=7) - sizes: 28-34 - colors: Xanh Dương
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(7, 10, 5, 'QJN-SF-28-XD', '8934567890030-28-XD', 699000, 350000, 20, TRUE),
(7, 11, 5, 'QJN-SF-29-XD', '8934567890030-29-XD', 699000, 350000, 25, TRUE),
(7, 12, 5, 'QJN-SF-30-XD', '8934567890030-30-XD', 699000, 350000, 30, TRUE),
(7, 13, 5, 'QJN-SF-31-XD', '8934567890030-31-XD', 699000, 350000, 25, TRUE),
(7, 14, 5, 'QJN-SF-32-XD', '8934567890030-32-XD', 699000, 350000, 20, TRUE),
(7, 15, 5, 'QJN-SF-33-XD', '8934567890030-33-XD', 699000, 350000, 15, TRUE),
(7, 16, 5, 'QJN-SF-34-XD', '8934567890030-34-XD', 699000, 350000, 10, TRUE);

-- Quần Jeans Wide Leg Nam (product_id=8) - sizes: 28-34 - colors: Xanh Dương
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(8, 10, 5, 'QJN-WL-28-XD', '8934567890031-28-XD', 749000, 380000, 15, TRUE),
(8, 11, 5, 'QJN-WL-29-XD', '8934567890031-29-XD', 749000, 380000, 20, TRUE),
(8, 12, 5, 'QJN-WL-30-XD', '8934567890031-30-XD', 749000, 380000, 25, TRUE),
(8, 13, 5, 'QJN-WL-31-XD', '8934567890031-31-XD', 749000, 380000, 20, TRUE),
(8, 14, 5, 'QJN-WL-32-XD', '8934567890031-32-XD', 749000, 380000, 15, TRUE),
(8, 15, 5, 'QJN-WL-33-XD', '8934567890031-33-XD', 749000, 380000, 10, TRUE),
(8, 16, 5, 'QJN-WL-34-XD', '8934567890031-34-XD', 749000, 380000, 8, TRUE);

-- Áo Khoác Gió (product_id=23) - sizes: S,M,L,XL,XXL - colors: Đen, Xanh Navy
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(23, 2, 1, 'AKG-GIO-S-DEN', '8934567890120-S-DEN', 699000, 350000, 20, TRUE),
(23, 3, 1, 'AKG-GIO-M-DEN', '8934567890120-M-DEN', 699000, 350000, 25, TRUE),
(23, 4, 1, 'AKG-GIO-L-DEN', '8934567890120-L-DEN', 699000, 350000, 20, TRUE),
(23, 5, 1, 'AKG-GIO-XL-DEN', '8934567890120-XL-DEN', 699000, 350000, 15, TRUE),
(23, 6, 1, 'AKG-GIO-XXL-DEN', '8934567890120-XXL-DEN', 699000, 350000, 10, TRUE),
(23, 2, 4, 'AKG-GIO-S-NAV', '8934567890120-S-NAV', 699000, 350000, 15, TRUE),
(23, 3, 4, 'AKG-GIO-M-NAV', '8934567890120-M-NAV', 699000, 350000, 20, TRUE),
(23, 4, 4, 'AKG-GIO-L-NAV', '8934567890120-L-NAV', 699000, 350000, 15, TRUE),
(23, 5, 4, 'AKG-GIO-XL-NAV', '8934567890120-XL-NAV', 699000, 350000, 10, TRUE),
(23, 6, 4, 'AKG-GIO-XXL-NAV', '8934567890120-XXL-NAV', 699000, 350000, 5, TRUE);

-- Thắt Lưng (product_id=29) - sizes: 75,80,85,90,95 - colors: Đen, Nâu
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(29, 23, 1, 'TLD-BO-75-DEN', '8934567890150-75-DEN', 599000, 300000, 25, TRUE),
(29, 24, 1, 'TLD-BO-80-DEN', '8934567890150-80-DEN', 599000, 300000, 30, TRUE),
(29, 25, 1, 'TLD-BO-85-DEN', '8934567890150-85-DEN', 599000, 300000, 25, TRUE),
(29, 26, 1, 'TLD-BO-90-DEN', '8934567890150-90-DEN', 599000, 300000, 15, TRUE),
(29, 27, 1, 'TLD-BO-95-DEN', '8934567890150-95-DEN', 599000, 300000, 10, TRUE),
(29, 23, 14, 'TLD-BO-75-NAU', '8934567890150-75-NAU', 599000, 300000, 20, TRUE),
(29, 24, 14, 'TLD-BO-80-NAU', '8934567890150-80-NAU', 599000, 300000, 25, TRUE),
(29, 25, 14, 'TLD-BO-85-NAU', '8934567890150-85-NAU', 599000, 300000, 20, TRUE),
(29, 26, 14, 'TLD-BO-90-NAU', '8934567890150-90-NAU', 599000, 300000, 12, TRUE),
(29, 27, 14, 'TLD-BO-95-NAU', '8934567890150-95-NAU', 599000, 300000, 8, TRUE);

-- Túi Xách Nữ (product_id=27) - no size - colors: Đen, Be
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(27, NULL, 1, 'TXN-MINI-DEN', '8934567890140-DEN', 449000, 225000, 50, TRUE),
(27, NULL, 13, 'TXN-MINI-BE', '8934567890140-BE', 449000, 225000, 45, TRUE);

-- Khăn Choàng (product_id=30) - no size - colors: Hồng Phấn, Kem
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(30, NULL, 9, 'KCN-LUA-HP', '8934567890160-HP', 299000, 150000, 60, TRUE),
(30, NULL, 12, 'KCN-LUA-KEM', '8934567890160-KEM', 299000, 150000, 55, TRUE);

-- Mũ Snapback (product_id=31) - no size - colors: Đen, Xám
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(31, NULL, 1, 'MSN-SNAP-DEN', '8934567890170-DEN', 249000, 125000, 60, TRUE),
(31, NULL, 3, 'MSN-SNAP-XAM', '8934567890171-XAM', 249000, 125000, 50, TRUE);

-- Áo Thun Trẻ Em Bé Gái Hoa (product_id=34) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Hồng(8), Trắng(2)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(34, 28, 8, 'ATT-BG-HOA-3T-HG', '8934567890200-3T-HG', 149000, 75000, 25, TRUE),
(34, 29, 8, 'ATT-BG-HOA-5T-HG', '8934567890200-5T-HG', 149000, 75000, 30, TRUE),
(34, 30, 8, 'ATT-BG-HOA-7T-HG', '8934567890200-7T-HG', 149000, 75000, 25, TRUE),
(34, 28, 2, 'ATT-BG-HOA-3T-TRA', '8934567890200-3T-TRA', 149000, 75000, 20, TRUE),
(34, 29, 2, 'ATT-BG-HOA-5T-TRA', '8934567890200-5T-TRA', 149000, 75000, 25, TRUE),
(34, 30, 2, 'ATT-BG-HOA-7T-TRA', '8934567890200-7T-TRA', 149000, 75000, 20, TRUE);

-- Áo Thun Trẻ Em Bé Trai Cars (product_id=35) - sizes: 5-6T(29), 7-8T(30), 8-9T(31) - colors: Xanh Dương(5), Đỏ(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(35, 29, 5, 'ATT-BT-CARS-5T-XD', '8934567890201-5T-XD', 159000, 80000, 20, TRUE),
(35, 30, 5, 'ATT-BT-CARS-7T-XD', '8934567890201-7T-XD', 159000, 80000, 25, TRUE),
(35, 31, 5, 'ATT-BT-CARS-8T-XD', '8934567890201-8T-XD', 159000, 80000, 20, TRUE),
(35, 29, 7, 'ATT-BT-CARS-5T-DO', '8934567890201-5T-DO', 159000, 80000, 15, TRUE),
(35, 30, 7, 'ATT-BT-CARS-7T-DO', '8934567890201-7T-DO', 159000, 80000, 20, TRUE);

-- Áo Sơ Mi Trẻ Em Bé Gái (product_id=36) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Hồng Phấn(9), Kem(12)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(36, 28, 9, 'ASM-TE-BG-3T-HP', '8934567890202-3T-HP', 199000, 100000, 20, TRUE),
(36, 29, 9, 'ASM-TE-BG-5T-HP', '8934567890202-5T-HP', 199000, 100000, 25, TRUE),
(36, 30, 9, 'ASM-TE-BG-7T-HP', '8934567890202-7T-HP', 199000, 100000, 20, TRUE),
(36, 28, 12, 'ASM-TE-BG-3T-KEM', '8934567890202-3T-KEM', 199000, 100000, 15, TRUE),
(36, 29, 12, 'ASM-TE-BG-5T-KEM', '8934567890202-5T-KEM', 199000, 100000, 20, TRUE);

-- Quần Jeans Trẻ Em Bé Gái (product_id=37) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Xanh Nhạt(18), Hồng(8)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(37, 28, 18, 'QJT-BG-3T-XNH', '8934567890210-3T-XNH', 249000, 125000, 20, TRUE),
(37, 29, 18, 'QJT-BG-5T-XNH', '8934567890210-5T-XNH', 249000, 125000, 25, TRUE),
(37, 30, 18, 'QJT-BG-7T-XNH', '8934567890210-7T-XNH', 249000, 125000, 20, TRUE),
(37, 28, 8, 'QJT-BG-3T-HG', '8934567890210-3T-HG', 249000, 125000, 15, TRUE),
(37, 29, 8, 'QJT-BG-5T-HG', '8934567890210-5T-HG', 249000, 125000, 18, TRUE);

-- Quần Short Trẻ Em Bé Trai (product_id=38) - sizes: 5-6T(29), 7-8T(30), 8-9T(31) - colors: Xanh Dương(5), Đỏ(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(38, 29, 5, 'QST-BT-5T-XD', '8934567890211-5T-XD', 179000, 90000, 22, TRUE),
(38, 30, 5, 'QST-BT-7T-XD', '8934567890211-7T-XD', 179000, 90000, 28, TRUE),
(38, 31, 5, 'QST-BT-8T-XD', '8934567890211-8T-XD', 179000, 90000, 25, TRUE),
(38, 29, 7, 'QST-BT-5T-DO', '8934567890211-5T-DO', 179000, 90000, 18, TRUE),
(38, 30, 7, 'QST-BT-7T-DO', '8934567890211-7T-DO', 179000, 90000, 22, TRUE);

-- Quần Dài Trẻ Em Cạp Chun (product_id=39) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Xám(3), Đen(1)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(39, 28, 3, 'QDT-CACH-3T-XAM', '8934567890212-3T-XAM', 199000, 100000, 28, TRUE),
(39, 29, 3, 'QDT-CACH-5T-XAM', '8934567890212-5T-XAM', 199000, 100000, 32, TRUE),
(39, 30, 3, 'QDT-CACH-7T-XAM', '8934567890212-7T-XAM', 199000, 100000, 28, TRUE),
(39, 28, 1, 'QDT-CACH-3T-DEN', '8934567890212-3T-DEN', 199000, 100000, 22, TRUE),
(39, 29, 1, 'QDT-CACH-5T-DEN', '8934567890212-5T-DEN', 199000, 100000, 25, TRUE);

-- Váy Xếp Ly Trẻ Em (product_id=40) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Hồng Phấn(9), Kem(12)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(40, 28, 9, 'VXL-TE-3T-HP', '8934567890220-3T-HP', 229000, 115000, 18, TRUE),
(40, 29, 9, 'VXL-TE-5T-HP', '8934567890220-5T-HP', 229000, 115000, 22, TRUE),
(40, 30, 9, 'VXL-TE-7T-HP', '8934567890220-7T-HP', 229000, 115000, 18, TRUE),
(40, 28, 12, 'VXL-TE-3T-KEM', '8934567890220-3T-KEM', 229000, 115000, 15, TRUE),
(40, 29, 12, 'VXL-TE-5T-KEM', '8934567890220-5T-KEM', 229000, 115000, 18, TRUE);

-- Đầm Xòe Trẻ Em (product_id=41) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Hồng(8), Trắng(2)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(41, 28, 8, 'DXL-TE-3T-HG', '8934567890230-3T-HG', 299000, 150000, 15, TRUE),
(41, 29, 8, 'DXL-TE-5T-HG', '8934567890230-5T-HG', 299000, 150000, 18, TRUE),
(41, 30, 8, 'DXL-TE-7T-HG', '8934567890230-7T-HG', 299000, 150000, 15, TRUE),
(41, 28, 2, 'DXL-TE-3T-TRA', '8934567890230-3T-TRA', 299000, 150000, 12, TRUE),
(41, 29, 2, 'DXL-TE-5T-TRA', '8934567890230-5T-TRA', 299000, 150000, 15, TRUE);

-- Đầm Thun Trẻ Em (product_id=42) - sizes: 3-4T(28), 5-6T(29), 7-8T(30) - colors: Hồng Phấn(9), Xanh Mint(16)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(42, 28, 9, 'DTT-TE-3T-HP', '8934567890231-3T-HP', 199000, 100000, 20, TRUE),
(42, 29, 9, 'DTT-TE-5T-HP', '8934567890231-5T-HP', 199000, 100000, 25, TRUE),
(42, 30, 9, 'DTT-TE-7T-HP', '8934567890231-7T-HP', 199000, 100000, 20, TRUE),
(42, 28, 16, 'DTT-TE-3T-MINT', '8934567890231-3T-MINT', 199000, 100000, 15, TRUE),
(42, 29, 16, 'DTT-TE-5T-MINT', '8934567890231-5T-MINT', 199000, 100000, 18, TRUE);

-- Bộ Đồ Thun Trẻ Em Bé Gái (product_id=43) - sizes: 3-4T(28), 5-6T(29) - colors: Hồng(8), Trắng(2)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(43, 28, 8, 'BDT-BG-3T-HG', '8934567890240-3T-HG', 349000, 175000, 13, TRUE),
(43, 29, 8, 'BDT-BG-5T-HG', '8934567890240-5T-HG', 349000, 175000, 16, TRUE),
(43, 28, 2, 'BDT-BG-3T-TRA', '8934567890240-3T-TRA', 349000, 175000, 12, TRUE),
(43, 29, 2, 'BDT-BG-5T-TRA', '8934567890240-5T-TRA', 349000, 175000, 14, TRUE);

-- Bộ Đồ Thể Thao Trẻ Em Bé Trai (product_id=44) - sizes: 5-6T(29), 7-8T(30), 8-9T(31) - colors: Xanh Dương(5), Đỏ(7)
INSERT INTO product_variants (product_id, size_id, color_id, sku, barcode, price, cost_price, stock, is_active) VALUES
(44, 29, 5, 'BDTT-BT-5T-XD', '8934567890241-5T-XD', 299000, 150000, 16, TRUE),
(44, 30, 5, 'BDTT-BT-7T-XD', '8934567890241-7T-XD', 299000, 150000, 20, TRUE),
(44, 31, 5, 'BDTT-BT-8T-XD', '8934567890241-8T-XD', 299000, 150000, 16, TRUE),
(44, 29, 7, 'BDTT-BT-5T-DO', '8934567890241-5T-DO', 299000, 150000, 14, TRUE),
(44, 30, 7, 'BDTT-BT-7T-DO', '8934567890241-7T-DO', 299000, 150000, 18, TRUE);

-- =====================================================
-- Seed: Shipping Providers
-- =====================================================
INSERT INTO shipping_providers (name, code, logo, website, tracking_url, is_active, sort_order) VALUES
('Giao hàng nhanh (GHN)', 'GHN', NULL, 'https://ghn.vn', 'https://track.ghn.vn/?code=', TRUE, 1),
('Giao hàng tiết kiệm (GHTK)', 'GHTK', NULL, 'https://ghtk.vn', 'https://track.ghtk.vn/?code=', TRUE, 2),
('Viettel Post', 'VIETTEL', NULL, 'https://viettelpost.com.vn', 'https://www.viettelpost.com.vn/track/', TRUE, 3),
('VNPost', 'VNPOST', NULL, 'https://www.vnpost.vn', 'https://www.vnpost.vn/track/', TRUE, 4);

-- =====================================================
-- Seed: Shipping Zones
-- =====================================================
INSERT INTO shipping_zones (name, cities, is_active, sort_order) VALUES
('TP.HCM & Lân cận', '["TP.HCM", "Bình Dương", "Đồng Nai", "Long An"]', TRUE, 1),
('Hà Nội & Lân cận', '["Hà Nội", "Hải Phòng", "Hưng Yên", "Bắc Ninh"]', TRUE, 2),
('Miền Trung', '["Đà Nẵng", "Hội An", "Huế", "Nha Trang", "Quy Nhơn"]', TRUE, 3),
('Miền Tây', '["Cần Thơ", "An Giang", "Kiên Giang", "Tiền Giang", "Đồng Tháp"]', TRUE, 4),
('Tây Nguyên', '["Đà Lạt", "Pleiku", "Buôn Ma Thuột"]', TRUE, 5),
('Miền Bắc', '["Hải Phòng", "Nam Định", "Thái Bình", "Nghệ An", "Thanh Hóa"]', TRUE, 6),
('Toàn quốc', '["Toàn quốc"]', TRUE, 7);

-- =====================================================
-- Seed: Shipping Fees
-- =====================================================
INSERT INTO shipping_fees (provider_id, zone_id, min_weight, max_weight, base_fee, fee_per_kg, estimated_days_min, estimated_days_max, is_active) VALUES
-- GHN
(1, 1, 0, 5, 25000, 3000, 1, 2, TRUE),
(1, 2, 0, 5, 35000, 4000, 2, 3, TRUE),
(1, 3, 0, 5, 45000, 5000, 3, 5, TRUE),
(1, 4, 0, 5, 40000, 5000, 2, 4, TRUE),
(1, 5, 0, 5, 55000, 6000, 4, 6, TRUE),
(1, 6, 0, 5, 50000, 5500, 3, 5, TRUE),
(1, 7, 0, 5, 55000, 6000, 4, 7, TRUE),
-- GHTK
(2, 1, 0, 5, 22000, 2500, 1, 2, TRUE),
(2, 2, 0, 5, 33000, 3500, 2, 3, TRUE),
(2, 3, 0, 5, 44000, 4500, 3, 5, TRUE),
(2, 4, 0, 5, 38000, 4500, 2, 4, TRUE),
(2, 5, 0, 5, 55000, 5500, 4, 6, TRUE),
(2, 6, 0, 5, 48000, 5000, 3, 5, TRUE),
(2, 7, 0, 5, 55000, 5500, 4, 7, TRUE);

-- =====================================================
-- Seed: Payment Methods
-- =====================================================
INSERT INTO payment_methods (code, name, description, icon, is_online, is_active, sort_order, config) VALUES
('COD', 'Thanh toán khi nhận hàng (COD)', 'Thanh toán bằng tiền mặt khi nhận được hàng', 'cash', FALSE, TRUE, 1, '{"fee": 0}'),
('BANK_TRANSFER', 'Chuyển khoản ngân hàng', 'Chuyển khoản trực tiếp vào tài khoản ngân hàng của cửa hàng', 'credit-card', FALSE, TRUE, 2, '{"account_number": "1234567890", "bank_name": "Vietcombank"}'),
('VNPAY', 'Thanh toán qua VNPay', 'Thanh toán trực tuyến qua cổng thanh toán VNPay', 'credit-card', TRUE, TRUE, 3, '{"merchant_id": "VNPAY123", "return_url": "/payment/vnpay/return"}'),
('MOMO', 'Thanh toán MoMo', 'Thanh toán qua ví điện tử MoMo', 'wallet', TRUE, TRUE, 4, '{"partner_code": "MOMO123", "return_url": "/payment/momo/return"}');

-- =====================================================
-- Seed: Coupons
-- =====================================================
INSERT INTO coupons (code, name, description, coupon_type, discount_type, discount_value, max_discount_amount, min_order_amount, max_usage_total, max_usage_per_user, valid_from, valid_until, is_active, is_public) VALUES
('SUMMER20', 'Summer Sale 20%', 'Giảm 20% cho đơn hàng từ 500K', 'general', 'percentage', 20, 200000, 500000, 200, 1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, TRUE),
('NEWCUSTOMER', 'Khách hàng mới', 'Giảm 50K cho khách hàng mới', 'first_order', 'fixed_amount', 50000, NULL, 300000, 100, 1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, TRUE),
('VIP100K', 'VIP 100K', 'Giảm 100K cho đơn hàng từ 1 triệu', 'general', 'fixed_amount', 100000, NULL, 1000000, 50, 2, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, TRUE),
('FLASH15', 'Flash Sale 15%', 'Flash sale giảm 15% thứ 6', 'general', 'percentage', 15, 150000, 0, 300, 1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, TRUE),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn từ 800K', 'shipping', 'percentage', 100, NULL, 800000, 100, 1, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, TRUE);

-- =====================================================
-- Seed: Promotions
-- =====================================================
INSERT INTO promotions (name, slug, description, promotion_type, discount_type, discount_value, max_discount_amount, valid_from, valid_until, is_active, is_featured, priority) VALUES
('Summer Sale 2026', 'summer-sale-2026', 'Ưu đãi mùa hè - Giảm đến 30%', 'flash_sale', 'percentage', 30, 500000, '2026-05-01 00:00:00', '2026-08-31 23:59:59', TRUE, TRUE, 1),
('Mua 2 Tặng 1', 'mua-2-tang-1', 'Mua 2 sản phẩm cùng loại tặng 1', 'buy_x_get_y', 'percentage', 100, NULL, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, FALSE, 2),
('Combo Tiết Kiệm', 'combo-tiet-kiem', 'Mua bộ đồ thể thao tiết kiệm 20%', 'bundle', 'percentage', 20, NULL, '2026-01-01 00:00:00', '2026-12-31 23:59:59', TRUE, FALSE, 3);

-- =====================================================
-- Seed: Expense Categories
-- =====================================================
INSERT INTO expense_categories (name, code, description, parent_id, is_system, is_active) VALUES
('Nhập hàng', 'IMPORT', 'Chi phí nhập hàng từ nhà cung cấp', NULL, TRUE, TRUE),
('Mặt hàng', 'GOODS', 'Chi phí mặt hàng', 1, FALSE, TRUE),
('Vận chuyển', 'SHIPPING', 'Chi phí vận chuyển', 1, FALSE, TRUE),
('Thuế', 'TAX', 'Chi phí thuế', NULL, TRUE, TRUE),
('Thuế nhập khẩu', 'IMPORT_TAX', 'Thuế nhập khẩu hàng hóa', 4, FALSE, TRUE),
('VAT', 'VAT', 'Thuế VAT', 4, FALSE, TRUE),
('Nhân sự', 'HR', 'Chi phí nhân sự', NULL, TRUE, TRUE),
('Lương', 'SALARY', 'Chi phí lương', 7, FALSE, TRUE),
('Thưởng', 'BONUS', 'Chi phí thưởng', 7, FALSE, TRUE),
('Văn phòng', 'OFFICE', 'Chi phí văn phòng', NULL, TRUE, TRUE),
('Điện nước', 'UTILITY', 'Chi phí điện nước', 10, FALSE, TRUE),
('Thuê mặt bằng', 'RENT', 'Chi phí thuê mặt bằng', 10, FALSE, TRUE),
('Marketing', 'MARKETING', 'Chi phí marketing', NULL, TRUE, TRUE),
('Quảng cáo', 'ADS', 'Chi phí quảng cáo', 13, FALSE, TRUE),
('Khác', 'OTHER', 'Chi phí khác', NULL, TRUE, TRUE);

-- =====================================================
-- Seed: Product Reviews
-- NOTE: includes is_active column
-- =====================================================
INSERT INTO product_reviews (product_id, user_id, order_id, rating, title, content, pros, cons, size_rating, is_verified_purchase, is_approved, admin_reply, helpful_count, is_active, created_at) VALUES
(1, 2, NULL, 5, 'Áo đẹp, chất lượng tốt', 'Áo mặc rất thoáng, chất cotton mềm mại. Đường may đẹp, không bị tuột chỉ. Đóng gói cẩn thận. Shop tư vấn nhiệt tình. Sẽ ủng hộ tiếp!', 'Chất vải tốt, thoáng mát', 'Màu hơi nhạt hơn ảnh', 'fit', TRUE, TRUE, 'Cảm ơn bạn đã tin tưởng shop!', 15, TRUE, '2026-03-01 10:30:00'),
(1, 3, NULL, 4, 'Sản phẩm tốt, giao nhanh', 'Áo đẹp như hình, giao hàng nhanh trong 2 ngày. Mặc vừa form người. Điểm trừ vì màu hơi bị lem nhẹ khi giặt lần đầu.', 'Form đẹp, giá hợp lý', 'Màu lem nhẹ khi giặt', 'fit', TRUE, TRUE, 'Bạn nên giặt riêng lần đầu nhé!', 8, TRUE, '2026-03-05 14:20:00'),
(7, 4, NULL, 5, 'Quần jeans đẹp như mẫu', 'Quần jeans slim fit mặc rất vừa, ôm chân đẹp. Wash màu đẹp, không phai. Đi làm hay đi chơi đều phù hợp. Đã mua 2 cái!', 'Form đẹp, chất tốt', 'Hơi cứng lần đầu', 'fit', TRUE, TRUE, 'Cảm ơn bạn đã ủng hộ!', 22, TRUE, '2026-03-10 09:15:00'),
(15, 5, NULL, 4, 'Croptop xinh, giá ok', 'Áo croptop mặc xinh lắm, form đẹp tôn dáng. Phù hợp với giá tiền. Shop tặng kèm sticker dễ thương. Giao hàng nhanh.', 'Form đẹp, dễ phối', 'Hơi mỏng', 'large', TRUE, TRUE, 'Cảm ơn bạn!', 12, TRUE, '2026-03-15 16:45:00'),
(18, 6, NULL, 5, 'Đầm body quyến rũ', 'Đầm midi body mặc vào siêu quyến rũ luôn! Chất thun co giãn tốt, ôm body hoàn hảo. Đi tiệc được, đi chơi cũng được. Đã có 3 màu!', 'Ôm body, co giãn tốt', 'Cổ hơi rộng', 'fit', TRUE, TRUE, 'Chúc bạn luôn xinh đẹp!', 30, TRUE, '2026-03-20 11:30:00'),
(23, 7, NULL, 5, 'Áo khoác gió chất lượng', 'Áo khoác gió chống nước tốt, mặc vào mưa nhẹ không thấm. Form unisex nên mua cho chồng cùng mặc được. Rất hài lòng!', 'Chống nước tốt, form đẹp', 'Hơi nặng', 'fit', TRUE, TRUE, 'Cảm ơn bạn đã tin tưởng!', 18, TRUE, '2026-03-25 08:20:00');

-- =====================================================
-- Seed: Orders
-- NOTE: includes all order columns used in code
-- =====================================================
INSERT INTO orders (order_number, user_id, status, customer_name, customer_email, customer_phone, shipping_full_address, shipping_city, shipping_district, shipping_address, subtotal, shipping_fee, discount_amount, discount_code, total_price, payment_method, payment_status, points_earned, points_used, recipient_name, recipient_phone, ward, district, city, created_at) VALUES
('ORD-20260301-001', 2, 'delivered', 'Nguyễn Thị Lan', 'lan.nguyen@email.com', '0901234567', '78 Cái Khế, Quận Ninh Kiều, Cần Thơ', 'Cần Thơ', 'Quận Ninh Kiều', '78 Cái Khế', 1497000, 45000, 0, NULL, 1542000, 'cod', 'paid', 550, 0, 'Nguyễn Thị Lan', '0901234567', 'Cái Khế', 'Quận Ninh Kiều', 'Cần Thơ', '2026-03-01 10:30:00'),
('ORD-20260305-002', 3, 'delivered', 'Trần Văn Minh', 'minh.tran@email.com', '0912345678', '23 Đường 3 Tháng 2, Quận 10, TP.HCM', 'TP.HCM', 'Quận 10', '23 Đường 3 Tháng 2', 2097000, 25000, 209700, 'SUMMER20', 1498000, 'vnpay', 'paid', 890, 0, 'Trần Văn Minh', '0912345678', 'Phường 10', 'Quận 10', 'TP.HCM', '2026-03-05 14:20:00'),
('ORD-20260310-003', 4, 'shipped', 'Lê Hoài Trang', 'trang.le@email.com', '0934567890', '56 Lý Tự Trọng, Quận 1, TP.HCM', 'TP.HCM', 'Quận 1', '56 Lý Tự Trọng', 599000, 25000, 0, NULL, 624000, 'cod', 'paid', 180, 0, 'Lê Hoài Trang', '0934567890', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', '2026-03-10 09:15:00'),
('ORD-20260315-004', 5, 'processing', 'Phạm Đức Anh', 'anh.pham@email.com', '0945678901', '89 Pasteur, Quận 3, TP.HCM', 'TP.HCM', 'Quận 3', '89 Pasteur', 1197000, 25000, 0, NULL, 1222000, 'cod', 'paid', 420, 0, 'Phạm Đức Anh', '0945678901', 'Phường 6', 'Quận 3', 'TP.HCM', '2026-03-15 16:45:00'),
('ORD-20260320-005', 6, 'confirmed', 'Võ Thị Mai Hương', 'huong.vo@email.com', '0956789012', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'TP.HCM', 'Quận 1', '123 Nguyễn Huệ', 699000, 25000, 50000, 'NEWCUSTOMER', 674000, 'momo', 'paid', 320, 0, 'Võ Thị Mai Hương', '0956789012', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', '2026-03-20 11:30:00'),
('ORD-20260325-006', 7, 'pending', 'Hoàng Đức Mạnh', 'manh.hoang@email.com', '0967890123', '456 Trần Hưng Đạo, Quận 5, TP.HCM', 'TP.HCM', 'Quận 5', '456 Trần Hưng Đạo', 1697000, 25000, 0, NULL, 1722000, 'cod', 'unpaid', 750, 0, 'Hoàng Đức Mạnh', '0967890123', 'Phường 11', 'Quận 5', 'TP.HCM', '2026-03-25 08:20:00'),
('ORD-20260401-007', 8, 'pending', 'Trương Thị Hạnh', 'hanh.truong@email.com', '0978901234', '789 Lê Lai, Quận 3, TP.HCM', 'TP.HCM', 'Quận 3', '789 Lê Lai', 997000, 25000, 0, NULL, 1022000, 'cod', 'unpaid', 210, 0, 'Trương Thị Hạnh', '0978901234', 'Phường 6', 'Quận 3', 'TP.HCM', '2026-04-01 16:30:00');

-- =====================================================
-- Seed: Order Items
-- =====================================================
INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_sku, product_image, size_name, color_name, unit_price, quantity, discount_amount, total_price) VALUES
-- Order 1
(1, 1, 2, 'Áo Thun Nam Basic Cotton 100%', 'ATN-BC-M-DEN', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'M', 'Đen', 299000, 2, 0, 598000),
(1, 13, NULL, 'Áo Thun Nữ Basic Trơn', 'ATN-BASIC-002', 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&h=800&fit=crop', 'S', 'Trắng', 199000, 2, 0, 398000),
(1, 15, NULL, 'Áo Croptop Nữ Thun Co Giãn', 'ACT-CROP-001', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=800&fit=crop', 'M', 'Đen', 199000, 1, 0, 199000),
(1, 31, NULL, 'Mũ Snapback Nam Unisex', 'MSN-SNAP-001', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop', NULL, 'Đen', 249000, 1, 0, 249000),
-- Order 2
(2, 7, NULL, 'Quần Jeans Nam Slim Fit Wash Nhẹ', 'QJN-SLIM-001', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', '30', 'Xanh Dương', 699000, 1, 139800, 559200),
(2, 24, NULL, 'Áo Blazer Nam Slim Fit', 'ABL-SLIM-001', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop', 'M', 'Xám', 1299000, 1, 259800, 1039200),
-- Order 3
(3, 18, NULL, 'Đầm Midi Ôm Body Sexy', 'DMN-BODY-001', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop', 'M', 'Đen', 699000, 1, 0, 699000),
-- Order 4
(4, 11, NULL, 'Áo Blouse Nữ Lụa Cao Cấp', 'ABN-LUA-001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop', 'M', 'Trắng', 599000, 1, 0, 599000),
(4, 16, NULL, 'Chân Váy Midi Xếp Ly', 'CVM-XEP-001', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=800&fit=crop', 'M', 'Đen', 399000, 1, 0, 399000),
(4, 27, NULL, 'Túi Xách Nữ Đeo Chéo Minimal', 'TXN-MINI-001', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop', NULL, 'Đen', 449000, 1, 0, 449000),
-- Order 5
(5, 23, NULL, 'Áo Khoác Gió Nam Nữ Unisex', 'AKG-GIO-001', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop', 'M', 'Xanh Navy', 699000, 1, 0, 699000),
-- Order 6
(6, 2, NULL, 'Áo Thun Nam Oversize Graphic', 'ATN-OVER-001', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop', 'L', 'Đen', 449000, 2, 0, 898000),
(6, 8, NULL, 'Quần Jeans Nam Wide Leg', 'QJN-WIDE-001', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop', '30', 'Xanh Dương', 749000, 1, 0, 749000),
-- Order 7
(7, 13, NULL, 'Áo Thun Nữ Basic Trơn', 'ATN-BASIC-002', 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&h=800&fit=crop', 'M', 'Trắng', 199000, 3, 0, 597000),
(7, 30, NULL, 'Khăn Choàng Nữ Lụa Cao Cấp', 'KCN-LUA-001', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop', NULL, 'Kem', 299000, 1, 0, 299000);

-- =====================================================
-- Seed: Wishlists
-- NOTE: uses product_id (not stock_quantity)
-- =====================================================
INSERT INTO wishlists (user_id, product_id, created_at) VALUES
(2, 7, '2026-03-05 16:00:00'),
(2, 18, '2026-03-10 10:00:00'),
(3, 1, '2026-03-12 14:30:00'),
(4, 11, '2026-03-15 09:00:00'),
(5, 23, '2026-03-18 11:00:00'),
(6, 15, '2026-03-20 15:00:00'),
(7, 21, '2026-03-22 10:30:00'),
(8, 32, '2026-04-01 08:00:00');

-- =====================================================
-- Seed: Reward Points
-- =====================================================
INSERT INTO reward_points (user_id, points, points_type, balance_after, description, order_id, created_at) VALUES
(2, 550, 'earn', 1500, 'Tích điểm từ đơn hàng #ORD001', 1, '2026-02-15 14:30:00'),
(2, -100, 'redeem', 1400, 'Đổi điểm giảm giá', NULL, '2026-03-01 10:00:00'),
(3, 890, 'earn', 2800, 'Tích điểm từ đơn hàng #ORD002', 2, '2026-02-20 16:45:00'),
(4, 180, 'earn', 500, 'Tích điểm từ đơn hàng #ORD003', 3, '2026-03-05 11:20:00'),
(5, 420, 'earn', 1200, 'Tích điểm từ đơn hàng #ORD004', 4, '2026-03-10 09:30:00'),
(6, 320, 'earn', 800, 'Tích điểm từ đơn hàng #ORD005', 5, '2026-03-15 15:00:00'),
(7, 750, 'earn', 2200, 'Tích điểm từ đơn hàng #ORD006', 6, '2026-03-20 13:45:00'),
(8, 210, 'earn', 600, 'Tích điểm từ đơn hàng #ORD007', 7, '2026-03-25 10:15:00');

-- =====================================================
-- Seed: Stock Movements
-- =====================================================
INSERT INTO stock_movements (product_id, variant_id, warehouse_id, movement_type, quantity, quantity_before, quantity_after, unit_cost, reference_type, supplier_id, employee_id, reason, note, created_at, created_by) VALUES
-- Nhập hàng ban đầu
(1, NULL, 1, 'import', 200, 0, 200, 150000, 'initial_stock', 1, 3, 'Nhập hàng ban đầu', 'Nhập kho lần đầu', '2026-01-15 09:00:00', 1),
(7, NULL, 1, 'import', 100, 0, 100, 350000, 'initial_stock', 2, 3, 'Nhập hàng ban đầu', 'Nhập kho lần đầu', '2026-01-20 10:00:00', 1),
(18, NULL, 1, 'import', 50, 0, 50, 350000, 'initial_stock', 2, 3, 'Nhập hàng ban đầu', 'Nhập kho lần đầu', '2026-01-25 11:00:00', 1),
-- Bán hàng (xuất kho)
(1, NULL, 1, 'export', -2, 200, 198, 150000, 'order', NULL, NULL, 'Bán hàng online', 'Đơn hàng ORD-20260301-001', '2026-03-01 10:35:00', 1),
(7, NULL, 1, 'export', -1, 100, 99, 350000, 'order', NULL, NULL, 'Bán hàng online', 'Đơn hàng ORD-20260305-002', '2026-03-05 14:25:00', 1),
-- Điều chỉnh tồn kho
(1, NULL, 1, 'adjustment', -5, 200, 195, 150000, NULL, NULL, 3, 'Kiểm kê phát hiện thiếu', 'Thiếu 5 cái khi kiểm kê', '2026-02-28 16:00:00', 1),
-- Khách trả hàng
(15, NULL, 1, 'return_in', 1, 0, 1, 95000, 'return_request', NULL, NULL, 'Khách đổi size', 'Đổi size M sang L', '2026-03-10 15:00:00', 1);

-- =====================================================
-- Seed: Supplier Orders (Đơn nhập hàng)
-- =====================================================
INSERT INTO supplier_orders (order_code, supplier_id, warehouse_id, employee_id, status, order_date, expected_date, subtotal, discount_amount, total_amount, paid_amount, payment_status, note, created_at) VALUES
('PO-2026-001', 1, 1, 3, 'received', '2026-01-10', '2026-01-20', 15000000, 500000, 14500000, 14500000, 'paid', 'Nhập hàng tháng 1/2026', '2026-01-10 09:00:00'),
('PO-2026-002', 2, 1, 3, 'received', '2026-02-05', '2026-02-15', 25000000, 1000000, 24000000, 24000000, 'paid', 'Nhập hàng tháng 2/2026', '2026-02-05 10:00:00'),
('PO-2026-003', 3, 1, 3, 'partial_received', '2026-03-01', '2026-03-10', 30000000, 1500000, 28500000, 15000000, 'partial', 'Nhập hàng tháng 3/2026', '2026-03-01 08:00:00'),
('PO-2026-004', 1, 1, 3, 'pending', '2026-03-20', '2026-03-30', 18000000, 0, 18000000, 0, 'unpaid', 'Nhập hàng bổ sung', '2026-03-20 14:00:00');

-- =====================================================
-- Seed: Supplier Order Items
-- =====================================================
INSERT INTO supplier_order_items (supplier_order_id, product_id, variant_id, size_id, color_id, product_name, product_sku, quantity_ordered, quantity_received, quantity_remaining, unit_cost, total_cost) VALUES
-- PO-001
(1, 1, NULL, NULL, NULL, 'Áo Thun Nam Basic Cotton 100%', 'ATN-BASIC-001', 200, 200, 0, 150000, 30000000),
(1, 13, NULL, NULL, NULL, 'Áo Thun Nữ Basic Trơn', 'ATN-BASIC-002', 300, 300, 0, 100000, 30000000),
-- PO-002
(2, 7, NULL, NULL, NULL, 'Quần Jeans Nam Slim Fit Wash Nhẹ', 'QJN-SLIM-001', 100, 100, 0, 350000, 35000000),
(2, 18, NULL, NULL, NULL, 'Đầm Midi Ôm Body Sexy', 'DMN-BODY-001', 80, 80, 0, 350000, 28000000),
-- PO-003
(3, 23, NULL, NULL, NULL, 'Áo Khoác Gió Nam Nữ Unisex', 'AKG-GIO-001', 120, 100, 20, 350000, 42000000),
(3, 24, NULL, NULL, NULL, 'Áo Blazer Nam Slim Fit', 'ABL-SLIM-001', 50, 50, 0, 650000, 32500000);

-- =====================================================
-- Seed: Expenses
-- =====================================================
INSERT INTO expenses (expense_code, category_id, warehouse_id, description, amount, expense_date, payment_method, supplier_id, employee_id, status, note, created_at) VALUES
('EXP-2026-001', 2, 1, 'Nhập hàng từ Công ty Phương Nam', 14500000, '2026-01-20', 'bank_transfer', 1, 3, 'paid', 'Thanh toán PO-2026-001', '2026-01-20 15:00:00'),
('EXP-2026-002', 2, 1, 'Nhập hàng từ Công ty Thắng Lợi', 24000000, '2026-02-15', 'bank_transfer', 2, 3, 'paid', 'Thanh toán PO-2026-002', '2026-02-15 16:00:00'),
('EXP-2026-003', 11, NULL, 'Tiền điện tháng 1/2026', 3500000, '2026-02-01', 'cash', NULL, 5, 'paid', 'Điện tháng 1', '2026-02-01 10:00:00'),
('EXP-2026-004', 12, NULL, 'Tiền thuê mặt bằng tháng 1/2026', 25000000, '2026-01-05', 'bank_transfer', NULL, 5, 'paid', 'Tiền thuê tháng 1', '2026-01-05 09:00:00'),
('EXP-2026-005', 8, NULL, 'Lương nhân viên tháng 1/2026', 45000000, '2026-02-05', 'bank_transfer', NULL, 5, 'paid', 'Lương 5 nhân viên', '2026-02-05 12:00:00'),
('EXP-2026-006', 14, NULL, 'Quảng cáo Facebook Ads', 5000000, '2026-03-01', 'bank_transfer', NULL, 4, 'paid', 'Chiến dịch tháng 3', '2026-03-01 11:00:00');

-- =====================================================
-- Seed: News
-- =====================================================
INSERT INTO news (title, slug, summary, content, thumbnail, author_name, category, tags, is_featured, is_published, published_at) VALUES
('Xu hướng thời trang 2026: Những gì đang lên ngôi', 'xu-huong-thoi-trang-2026', 'Khám phá những xu hướng thời trang nổi bật nhất năm 2026 từ runway đến street style.', '<p>Năm 2026 hứa hẹn mang đến nhiều bất ngờ thú vị trong làng thời trang. Dưới đây là những xu hướng đáng chú ý:</p><h3>1. Y2K Revival</h3><p>Phong cách Y2K từ đầu những năm 2000 đang quay trở lại mạnh mẽ.</p><h3>2. Quiet Luxury</h3><p>Luxury tối giản - phong cách "nghèo sang" đang được giới trẻ yêu thích.</p><h3>3. Sustainable Fashion</h3><p>Thời trang bền vững ngày càng được quan tâm.</p>', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', 'Fashion Team', 'Xu hướng', '["2026","xu hướng","thời trang"]', TRUE, TRUE, '2026-01-01 10:00:00'),

('Hướng dẫn phối đồ cho nàng công sở', 'huong-dan-phoi-do-cho-nang-cong-so', 'Trở thành cô gái công sở thời trang với những tips phối đồ đơn giản.', '<p>Đi làm không có nghĩa là phải nhàm chán. Dưới đây là những gợi ý phối đồ giúp nàng công sở trở nên chuyên nghiệp mà vẫn thời trang.</p><h3>1. Basic Items là Chìa Khóa</h3><p>Đầu tiên, hãy đầu tư vào những basic items chất lượng.</p>', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop', 'Style Advisor', 'Phong cách', '["công sở","phối đồ","office style"]', TRUE, TRUE, '2026-01-15 10:00:00'),

('Cách bảo quản quần áo bền đẹp như mới', 'cach-bao-quan-quan-ao-ben-dep-nhu-moi', 'Những mẹo đơn giản giúp quần áo của bạn luôn bền đẹp.', '<p>Quần áo đắt tiền cần được bảo quản đúng cách để luôn đẹp như mới.</p><h3>1. Đọc Nhãn Giặt</h3><p>Luôn đọc nhãn hướng dẫn giặt trước khi thực hiện.</p>', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop', 'Care Guide', 'Hướng dẫn', '["bảo quản","giặt ủi","care tips"]', FALSE, TRUE, '2026-02-01 10:00:00'),

('Top 5 item không thể thiếu trong tủ đồ nam giới', 'top-5-item-khong-the-thieu-trong-tu-do-nam-gioi', 'Khám phá 5 món đồ cơ bản mà mọi chàng trai đều cần có.', '<p>Một tủ đồ nam giới hoàn chỉnh không cần quá nhiều, chỉ cần đủ những item thiết yếu và chất lượng.</p><h3>1. Áo Thun Basic</h3><p>Áo thun cotton trắng, đen là nền tảng của mọi outfit.</p>', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop', 'Gentleman Guide', 'Nam giới', '["men fashion","basic items"]', TRUE, TRUE, '2026-02-15 10:00:00');

-- =====================================================
-- Seed: Contacts
-- =====================================================
INSERT INTO contacts (name, email, phone, subject, message, contact_type, priority, status, is_replied, source, created_at) VALUES
('Hoàng Văn Tuấn', 'tuan.hoang@email.com', '0909876543', 'Hỏi về sản phẩm', 'Tôi muốn hỏi về áo blazer nam size L có còn hàng không?', 'general', 'medium', 'new', FALSE, 'website', '2026-03-01 10:00:00'),
('Trần Thị Hương', 'huong.tran@email.com', '0912345679', 'Chính sách đổi trả', 'Tôi muốn đổi size áo croptop đã mua online. Sản phẩm còn nguyên tag.', 'general', 'high', 'in_progress', FALSE, 'website', '2026-03-05 14:00:00'),
('Lê Đức Minh', 'minh.le@email.com', '0987654321', 'Hợp tác kinh doanh', 'Tôi muốn hỏi về chương trình dropship của cửa hàng.', 'partnership', 'high', 'replied', TRUE, 'email', '2026-03-10 09:00:00'),
('Nguyễn Thu Hà', 'ha.nguyen@email.com', '0932198765', 'Kiểm tra đơn hàng', 'Tôi đã đặt đơn hàng ORD-20260301-001 cách đây 3 ngày.', 'general', 'low', 'resolved', TRUE, 'website', '2026-03-15 16:00:00'),
('Đặng Minh Châu', 'chau.dang@email.com', '0941234567', 'Tư vấn mua hàng', 'Tôi cần mua một bộ đồ đi tiệc cho mẹ, ngân sách khoảng 2 triệu.', 'general', 'medium', 'new', FALSE, 'website', '2026-03-20 11:00:00'),
('Công ty ABC', 'contact@abc.com', '02812345678', 'Bảo hành sản phẩm', 'Sản phẩm áo khoác bị hỏng zipper sau 1 tuần sử dụng.', 'warranty', 'urgent', 'assigned', FALSE, 'email', '2026-03-25 15:00:00');

-- =====================================================
-- Seed: Settings
-- =====================================================
INSERT INTO settings (setting_key, setting_value, setting_type, group_name, description) VALUES
-- General
('site_name', 'Clothing Store', 'string', 'general', 'Tên cửa hàng'),
('site_description', 'Cửa hàng quần áo thời trang - Phong cách riêng của bạn', 'string', 'general', 'Mô tả cửa hàng'),
('site_logo', '/logo.svg', 'string', 'general', 'Logo cửa hàng'),
('site_favicon', '/favicon.ico', 'string', 'general', 'Favicon'),
('site_email', 'contact@clothing-store.vn', 'string', 'general', 'Email cửa hàng'),
-- Contact
('contact_phone', '0909 123 456', 'string', 'contact', 'Số điện thoại liên hệ'),
('contact_hotline', '1900 1234', 'string', 'contact', 'Hotline'),
('contact_address', '456 Nguyễn Trãi, Quận 5, TP.HCM', 'string', 'contact', 'Địa chỉ cửa hàng'),
('contact_email', 'contact@clothing-store.vn', 'string', 'contact', 'Email liên hệ'),
('contact_zalo', '0909123456', 'string', 'contact', 'Zalo'),
('contact_facebook', 'https://facebook.com/clothingstore', 'string', 'contact', 'Facebook'),
-- Working Hours
('working_hours', '{"monday": "8:00 - 21:00", "tuesday": "8:00 - 21:00", "wednesday": "8:00 - 21:00", "thursday": "8:00 - 21:00", "friday": "8:00 - 21:00", "saturday": "9:00 - 22:00", "sunday": "9:00 - 22:00"}', 'json', 'contact', 'Giờ làm việc'),
-- Shipping
('free_shipping_threshold', '500000', 'number', 'shipping', 'Ngưỡng miễn phí vận chuyển (VNĐ)'),
('default_shipping_fee', '30000', 'number', 'shipping', 'Phí vận chuyển mặc định (VNĐ)'),
('default_shipping_provider', 'GHN', 'string', 'shipping', 'Đơn vị vận chuyển mặc định'),
-- Payment
('cod_fee', '0', 'number', 'payment', 'Phí COD (%)'),
('tax_rate', '10', 'number', 'payment', 'Thuế VAT (%)'),
('min_order_amount', '100000', 'number', 'payment', 'Giá trị đơn hàng tối thiểu'),
-- Display
('pagination_limit', '12', 'number', 'display', 'Số sản phẩm mỗi trang'),
('pagination_news_limit', '6', 'number', 'display', 'Số tin tức mỗi trang'),
('related_products_limit', '4', 'number', 'display', 'Số sản phẩm liên quan'),
-- Reward Points
('points_per_1000', '10', 'number', 'reward', 'Điểm tích lũy cho mỗi 1000đ'),
('points_redemption_rate', '100', 'number', 'reward', 'Tỷ lệ đổi điểm (1 điểm = X VNĐ)'),
-- Business Info
('tax_code', '0301234567', 'string', 'business', 'Mã số thuế'),
('business_license', '0101234567', 'string', 'business', 'Giấy phép kinh doanh'),
-- Inventory
('low_stock_threshold', '10', 'number', 'inventory', 'Ngưỡng cảnh báo tồn kho thấp');

-- =====================================================
-- Dat lai bo dem id (neu khong, them ban ghi moi se bao trung khoa)
-- =====================================================
SELECT setval(pg_get_serial_sequence('activity_logs','id'), GREATEST(COALESCE((SELECT MAX(id) FROM activity_logs), 0), 1));
SELECT setval(pg_get_serial_sequence('addresses','id'), GREATEST(COALESCE((SELECT MAX(id) FROM addresses), 0), 1));
SELECT setval(pg_get_serial_sequence('brands','id'), GREATEST(COALESCE((SELECT MAX(id) FROM brands), 0), 1));
SELECT setval(pg_get_serial_sequence('cart_items','id'), GREATEST(COALESCE((SELECT MAX(id) FROM cart_items), 0), 1));
SELECT setval(pg_get_serial_sequence('categories','id'), GREATEST(COALESCE((SELECT MAX(id) FROM categories), 0), 1));
SELECT setval(pg_get_serial_sequence('colors','id'), GREATEST(COALESCE((SELECT MAX(id) FROM colors), 0), 1));
SELECT setval(pg_get_serial_sequence('contacts','id'), GREATEST(COALESCE((SELECT MAX(id) FROM contacts), 0), 1));
SELECT setval(pg_get_serial_sequence('coupon_usage','id'), GREATEST(COALESCE((SELECT MAX(id) FROM coupon_usage), 0), 1));
SELECT setval(pg_get_serial_sequence('coupons','id'), GREATEST(COALESCE((SELECT MAX(id) FROM coupons), 0), 1));
SELECT setval(pg_get_serial_sequence('employees','id'), GREATEST(COALESCE((SELECT MAX(id) FROM employees), 0), 1));
SELECT setval(pg_get_serial_sequence('expense_categories','id'), GREATEST(COALESCE((SELECT MAX(id) FROM expense_categories), 0), 1));
SELECT setval(pg_get_serial_sequence('expenses','id'), GREATEST(COALESCE((SELECT MAX(id) FROM expenses), 0), 1));
SELECT setval(pg_get_serial_sequence('news','id'), GREATEST(COALESCE((SELECT MAX(id) FROM news), 0), 1));
SELECT setval(pg_get_serial_sequence('notifications','id'), GREATEST(COALESCE((SELECT MAX(id) FROM notifications), 0), 1));
SELECT setval(pg_get_serial_sequence('order_items','id'), GREATEST(COALESCE((SELECT MAX(id) FROM order_items), 0), 1));
SELECT setval(pg_get_serial_sequence('orders','id'), GREATEST(COALESCE((SELECT MAX(id) FROM orders), 0), 1));
SELECT setval(pg_get_serial_sequence('payment_methods','id'), GREATEST(COALESCE((SELECT MAX(id) FROM payment_methods), 0), 1));
SELECT setval(pg_get_serial_sequence('product_images','id'), GREATEST(COALESCE((SELECT MAX(id) FROM product_images), 0), 1));
SELECT setval(pg_get_serial_sequence('product_reviews','id'), GREATEST(COALESCE((SELECT MAX(id) FROM product_reviews), 0), 1));
SELECT setval(pg_get_serial_sequence('product_variants','id'), GREATEST(COALESCE((SELECT MAX(id) FROM product_variants), 0), 1));
SELECT setval(pg_get_serial_sequence('products','id'), GREATEST(COALESCE((SELECT MAX(id) FROM products), 0), 1));
SELECT setval(pg_get_serial_sequence('promotions','id'), GREATEST(COALESCE((SELECT MAX(id) FROM promotions), 0), 1));
SELECT setval(pg_get_serial_sequence('return_requests','id'), GREATEST(COALESCE((SELECT MAX(id) FROM return_requests), 0), 1));
SELECT setval(pg_get_serial_sequence('reward_points','id'), GREATEST(COALESCE((SELECT MAX(id) FROM reward_points), 0), 1));
SELECT setval(pg_get_serial_sequence('settings','id'), GREATEST(COALESCE((SELECT MAX(id) FROM settings), 0), 1));
SELECT setval(pg_get_serial_sequence('shipping_fees','id'), GREATEST(COALESCE((SELECT MAX(id) FROM shipping_fees), 0), 1));
SELECT setval(pg_get_serial_sequence('shipping_providers','id'), GREATEST(COALESCE((SELECT MAX(id) FROM shipping_providers), 0), 1));
SELECT setval(pg_get_serial_sequence('shipping_zones','id'), GREATEST(COALESCE((SELECT MAX(id) FROM shipping_zones), 0), 1));
SELECT setval(pg_get_serial_sequence('sizes','id'), GREATEST(COALESCE((SELECT MAX(id) FROM sizes), 0), 1));
SELECT setval(pg_get_serial_sequence('stock_movements','id'), GREATEST(COALESCE((SELECT MAX(id) FROM stock_movements), 0), 1));
SELECT setval(pg_get_serial_sequence('supplier_order_items','id'), GREATEST(COALESCE((SELECT MAX(id) FROM supplier_order_items), 0), 1));
SELECT setval(pg_get_serial_sequence('supplier_orders','id'), GREATEST(COALESCE((SELECT MAX(id) FROM supplier_orders), 0), 1));
SELECT setval(pg_get_serial_sequence('suppliers','id'), GREATEST(COALESCE((SELECT MAX(id) FROM suppliers), 0), 1));
SELECT setval(pg_get_serial_sequence('users','id'), GREATEST(COALESCE((SELECT MAX(id) FROM users), 0), 1));
SELECT setval(pg_get_serial_sequence('warehouses','id'), GREATEST(COALESCE((SELECT MAX(id) FROM warehouses), 0), 1));
SELECT setval(pg_get_serial_sequence('wishlists','id'), GREATEST(COALESCE((SELECT MAX(id) FROM wishlists), 0), 1));

-- =====================================================
-- KIEM TRA: chay xong se hien bang tong ket ngay ben duoi
-- Doi chieu cot "so_dong" voi cot "can_co"
-- =====================================================
SELECT 'products'         AS bang, count(*) AS so_dong, 44 AS can_co FROM products
UNION ALL SELECT 'product_variants', count(*), 139 FROM product_variants
UNION ALL SELECT 'product_images',   count(*),  52 FROM product_images
UNION ALL SELECT 'categories',       count(*),  25 FROM categories
UNION ALL SELECT 'users',            count(*),   8 FROM users
UNION ALL SELECT 'orders',           count(*),   7 FROM orders
UNION ALL SELECT 'brands',           count(*),   6 FROM brands
UNION ALL SELECT 'product_reviews',  count(*),   6 FROM product_reviews
UNION ALL SELECT 'news',             count(*),   4 FROM news
ORDER BY so_dong DESC;
