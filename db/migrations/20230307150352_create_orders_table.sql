-- migrate:up
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status_id INT NOT NULL,
  detail TEXT NOT NULL,
  order_number VARCHAR(200) NOT NULL,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT orders_status_id_fkey FOREIGN KEY (status_id) REFERENCES order_status (id)
);

-- migrate:down
DROP TABLE orders;