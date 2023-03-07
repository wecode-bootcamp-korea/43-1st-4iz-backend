-- migrate:up
CREATE TABLE payment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  amount DECIMAL(20, 3) NOT NULL,
  payment_number VARCHAR(200) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- migrate:down
DROP TABLE payment;