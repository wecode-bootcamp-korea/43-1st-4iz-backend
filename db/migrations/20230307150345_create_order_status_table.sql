-- migrate:up
CREATE TABLE order_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- migrate:down
DROP TABLE order_status;

