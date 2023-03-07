-- migrate:up
CREATE TABLE product_subcategories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  subcategory_id INT NOT NULL,
  CONSTRAINT product_subcategories_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT product_subcategories_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES subcategories (id),
  UNIQUE (product_id, subcategory_id)
);

-- migrate:down
DROP TABLE product_subcategories;