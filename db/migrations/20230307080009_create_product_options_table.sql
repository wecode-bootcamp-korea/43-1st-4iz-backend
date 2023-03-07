-- migrate:up
CREATE TABLE product_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  color_id INT NOT NULL,
  size_id INT NOT NULL,
  color_name VARCHAR(100),
  size_name VARCHAR(100),
  CONSTRAINT product_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  UNIQUE (color_id, size_id)
);

-- migrate:down
DROP TABLE product_options;