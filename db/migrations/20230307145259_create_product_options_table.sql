-- migrate:up
CREATE TABLE product_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  color_name VARCHAR(100) NOT NULL,
  size_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT product_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  UNIQUE (color_name, size_name)
);

-- migrate:down
DROP TABLE product_options;