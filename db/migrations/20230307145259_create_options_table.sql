-- migrate:up
CREATE TABLE options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  color VARCHAR(100) NOT NULL,
  size VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT options_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  UNIQUE (color, size)
);

-- migrate:down
DROP TABLE options;