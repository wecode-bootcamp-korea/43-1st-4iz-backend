-- migrate:up
ALTER TABLE orders ADD option_id INT NOT NULL AFTER status_id;
ALTER TABLE orders ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER order_date;
ALTER TABLE orders ADD updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- migrate:dowm
ALTER TABLE orders DROP option_id;
ALTER TABLE orders ADD created_at;
ALTER TABLE orders ADD updated_at;
