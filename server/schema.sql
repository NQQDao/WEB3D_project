-- ============================================================================
-- HAVEN & HOME 3D INTERIOR - POSTGRESQL SCHEMA MIGRATION
-- ============================================================================

-- Kích hoạt extension sinh UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG NGƯỜI DÙNG (Users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    tier VARCHAR(50) DEFAULT 'Thành viên VIP',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG SẢN PHẨM NỘI THẤT (Products)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL,
    description TEXT,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG BIẾN THỂ VẬT LIỆU PBR 3D (Product Finishes)
CREATE TABLE IF NOT EXISTS product_finishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    finish_key VARCHAR(50) NOT NULL,
    finish_name VARCHAR(100) NOT NULL,
    material_type VARCHAR(50),
    color_hex VARCHAR(10) NOT NULL,
    roughness NUMERIC(3, 2) DEFAULT 0.80,
    metalness NUMERIC(3, 2) DEFAULT 0.05,
    price_extra NUMERIC(12, 2) DEFAULT 0.00,
    UNIQUE(product_id, finish_key)
);

-- 4. BẢNG KHÔNG GIAN 3D ĐÃ LƯU (Saved 3D Rooms)
CREATE TABLE IF NOT EXISTS saved_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_name VARCHAR(200) NOT NULL,
    finish_key VARCHAR(50) NOT NULL,
    finish_name VARCHAR(100),
    lighting_mode VARCHAR(50) NOT NULL,
    lighting_name VARCHAR(100),
    camera_view VARCHAR(50) DEFAULT 'overview',
    custom_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_rooms_user ON saved_rooms(user_id);

-- 5. BẢNG MÃ GIẢM GIÁ (Vouchers)
CREATE TABLE IF NOT EXISTS vouchers (
    code VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255),
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    min_order_value NUMERIC(12, 2) DEFAULT 0,
    times_used INT DEFAULT 0,
    usage_limit INT DEFAULT 1000,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. BẢNG GIỎ HÀNG (Carts)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255),
    voucher_code VARCHAR(50) REFERENCES vouchers(code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG CHI TIẾT GIỎ HÀNG 3D (Cart Items)
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(150) PRIMARY KEY, -- vd: 'hotspot-sofa_cognac'
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    finish_key VARCHAR(50),
    finish_name VARCHAR(100),
    swatch_color VARCHAR(10),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG ĐƠN HÀNG (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BẢNG MÓN ĐỒ TRONG ĐƠN HÀNG (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    finish_name VARCHAR(100),
    finish_color_hex VARCHAR(10),
    quantity INT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL
);

-- ============================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (Seed Data)
-- ============================================================================

-- Thêm sản phẩm nội thất
INSERT INTO products (id, name, category, base_price, description, specs)
VALUES
('hotspot-sofa', 'Sofa Luna Curve Lounge', 'Sofa 3 Chỗ Cao Cấp', 1499.00, 'Đệm mút đàn hồi đa tầng bọc vải Bouclé Bỉ êm ái, khung gỗ tự nhiên chống mối mọt.', '{"Kích thước": "220 x 95 x 82 cm", "Chất liệu bọc": "Bouclé / Da Bò / Nhung", "Khung chịu lực": "Gỗ Sồi Tự Nhiên & Thép", "Bảo hành": "10 năm chính hãng"}'::jsonb),
('hotspot-table', 'Bàn Trà Arlo Fluted Table', 'Bàn Trà Điêu Khắc', 480.00, 'Mặt đá cẩm thạch trắng Calacatta tự nhiên, kết hợp thân gỗ sồi gân sọc điêu khắc nghệ thuật.', '{"Đường kính": "68 cm", "Chiều cao": "38 cm", "Mặt bàn": "Đá Cẩm Thạch Tự Nhiên", "Thân bàn": "Gỗ Sồi Gân Sọc"}'::jsonb),
('hotspot-lamp', 'Đèn Cây Halo Arc Brass', 'Đèn Sàn Nghệ Thuật', 320.00, 'Cần vòm đồng thau xước thanh mảnh, đế đá tự nhiên nặng, ánh sáng vàng ấm 2700K dịu nhẹ.', '{"Chiều cao": "210 cm", "Độ vươn vòm": "120 cm", "Đế đèn": "Đá Cẩm Thạch Nguyên Khối", "Bóng đèn": "LED Warm White 2700K"}'::jsonb),
('hotspot-chair', 'Ghế Thư Giãn Terra Nordic', 'Ghế Tựa Đơn (Armchair)', 590.00, 'Thiết kế công thái học ôm trọn lưng, đệm mút mềm bọc nỉ ấm cúng, chân gỗ sồi thanh lịch.', '{"Kích thước": "78 x 82 x 78 cm", "Độ ngả lưng": "Công thái học 105°", "Chất liệu": "Vải dệt cao cấp & Gỗ Sồi", "Tải trọng": "180 kg"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Thêm biến thể chất liệu PBR cho Sofa
INSERT INTO product_finishes (product_id, finish_key, finish_name, material_type, color_hex, roughness, metalness)
VALUES
('hotspot-sofa', 'cream', 'Kem Bouclé (Ivory)', 'boucle', '#f3ece0', 0.88, 0.00),
('hotspot-sofa', 'cognac', 'Da Bò Cognac (Leather)', 'leather', '#9e522c', 0.38, 0.08),
('hotspot-sofa', 'sage', 'Xanh Rêu Velvet (Olive)', 'velvet', '#485844', 0.65, 0.02),
('hotspot-sofa', 'charcoal', 'Xám Khói Slate (Charcoal)', 'slate', '#2b2e34', 0.78, 0.02)
ON CONFLICT (product_id, finish_key) DO NOTHING;

-- Thêm voucher
INSERT INTO vouchers (code, description, discount_percent, min_order_value)
VALUES
('HAVEN10', 'Giảm 10% tổng đơn hàng đầu tiên', 10.00, 0),
('WELCOME50', 'Giảm trực tiếp $50 cho không gian mới', 0, 500.00)
ON CONFLICT (code) DO NOTHING;

