-- Создание таблицы клиентов
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы оборудования
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    inventory_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    daily_rate DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    specifications JSONB,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы аренды
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id),
    client_id INTEGER REFERENCES clients(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_return_date DATE,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'cancelled')),
    contract_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER REFERENCES rentals(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer')),
    notes TEXT
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Добавление тестовых данных
INSERT INTO clients (full_name, email, phone, company) VALUES
('Иван Петров', 'ivan.petrov@example.com', '+7 (999) 123-45-67', 'ООО Техно'),
('Мария Сидорова', 'maria.sidorova@example.com', '+7 (999) 234-56-78', 'ИП Сидорова'),
('Алексей Смирнов', 'alex.smirnov@example.com', '+7 (999) 345-67-89', 'Смирнов и Ко')
ON CONFLICT (email) DO NOTHING;

INSERT INTO equipment (inventory_number, name, category, description, daily_rate, status, specifications) VALUES
('EQ-001', 'MacBook Pro 16"', 'Ноутбуки', 'Мощный ноутбук для профессиональной работы', 2500.00, 'available', '{"cpu": "Apple M2 Pro", "ram": "32GB", "storage": "1TB SSD"}'),
('EQ-002', 'iPhone 15 Pro', 'Смартфоны', 'Флагманский смартфон Apple', 1500.00, 'rented', '{"storage": "256GB", "color": "Titanium"}'),
('EQ-003', 'iPad Pro 12.9"', 'Планшеты', 'Профессиональный планшет для творчества', 1800.00, 'available', '{"storage": "512GB", "connectivity": "Wi-Fi + Cellular"}'),
('EQ-004', 'Sony A7 IV', 'Камеры', 'Полнокадровая беззеркальная камера', 3500.00, 'available', '{"megapixels": "33MP", "video": "4K 60fps"}'),
('EQ-005', 'DJI Mavic 3', 'Дроны', 'Профессиональный дрон для съёмки', 4000.00, 'maintenance', '{"flight_time": "46 min", "camera": "Hasselblad"}'),
('EQ-006', 'Dell XPS 15', 'Ноутбуки', 'Высокопроизводительный ноутбук для бизнеса', 2200.00, 'available', '{"cpu": "Intel i9", "ram": "32GB", "gpu": "RTX 4060"}')
ON CONFLICT (inventory_number) DO NOTHING;

INSERT INTO rentals (equipment_id, client_id, start_date, end_date, total_amount, paid_amount, status, contract_number) VALUES
(2, 1, '2025-11-05', '2025-11-15', 15000.00, 15000.00, 'active', 'RNT-2025-001'),
(4, 2, '2025-11-08', '2025-11-12', 14000.00, 7000.00, 'active', 'RNT-2025-002'),
(1, 3, '2025-10-20', '2025-10-30', 25000.00, 25000.00, 'completed', 'RNT-2025-003')
ON CONFLICT (contract_number) DO NOTHING;

INSERT INTO payments (rental_id, amount, payment_method, notes) VALUES
(1, 15000.00, 'card', 'Полная оплата при получении'),
(2, 7000.00, 'transfer', 'Частичная оплата, остаток при возврате'),
(3, 25000.00, 'cash', 'Оплата наличными');