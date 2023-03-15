-- migrate:up
CREATE TABLE product_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  order_id INT NOT NULL,
  option_id INT NOT NULL,
  UNIQUE (product_id, order_id, option_id),
  CONSTRAINT product_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT product_orders_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- migrate:down
DROP TABLE product_orders;
