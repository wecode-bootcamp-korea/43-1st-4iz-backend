-- migrate:up
ALTER TABLE carts ADD option_id INT NOT NULL AFTER user_id;

-- migrate:down
ALTER TABLE carts DROP option_id INT NOT NULL;