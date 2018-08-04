-- Add the table definitions
CREATE DATABASE IF NOT EXISTS bamazon;

use bamazon; 

CREATE TABLE IF NOT EXISTS departments (

	id INT NOT NULL auto_increment,   
	name VARCHAR(50) NOT NULL,       
	over_head_cost float default 0,     
	PRIMARY KEY  (id)
);

CREATE TABLE IF NOT EXISTS products (

	id INT NOT NULL auto_increment,   
	name VARCHAR(50) NOT NULL,       
	department_id INT NOT NULL,     
	price  float NOT NULL,     
	quantity int default 0,
	PRIMARY KEY  (id),
	foreign key (department_id) references departments(id)
);
