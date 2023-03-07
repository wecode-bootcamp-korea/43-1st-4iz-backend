-- migrate:up
CREATE TABLE shipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  street VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL,
  zipcode VARCHAR(100) NOT NULL,
  phone_number VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  detail TEXT NOT NULL,
  tracking_number VARCHAR(200) NOT NULL,
  shipment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT shipment_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- migrate:down
DROP TABLE shipment;