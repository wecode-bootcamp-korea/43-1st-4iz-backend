-- migrate:up
CREATE TABLE product_carts (
  INT id PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  cart_id INT NOT NULL,
  CONSTRAINT product_carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id)
  CONSTRAINT product_carts_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES carts (id)
  UNIQUE (product_id, cart_id)
);

-- migrate:down
DROP TABLE product_carts;
