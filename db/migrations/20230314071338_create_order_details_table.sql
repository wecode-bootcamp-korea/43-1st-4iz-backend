-- migrate:up
CREATE TABLE order_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status_id INT NOT NULL,
  price_sum DECIMAL(15, 3) NOT NULL,
  quantity INT NOT NULL,
  UNIQUE(order_id, status_id),
  CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT order_details_status_id_fkey FOREIGN KEY (status_id) REFERENCES order_status (id)
);

-- migrate:down
DROP TABLE order_details;