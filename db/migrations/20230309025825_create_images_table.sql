-- migrate:up
CREATE TABLE images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  url VARCHAR(3000) NOT NULL,
  CONSTRAINT images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id)
);

-- migrate:down
DROP TABLE images;