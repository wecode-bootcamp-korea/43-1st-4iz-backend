-- migrate:up
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_status ENUM("Pending", "Completed", "Shipped", "Cancelled", "Refunded"),
  detail TEXT NOT NULL,
  order_number VARCHAR(200) NOT NULL,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id),
);

-- migrate:down
DROP TABLE orders;