-- migrate:up
CREATE TABLE product_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id),
  UNIQUE (product_id, category_id)
);

-- migrate:down
DROP TABLE product_categories;