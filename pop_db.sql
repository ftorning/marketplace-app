insert into bamazon.departments (name, over_head_cost)
values ('Electronics', .50),
       ('Home & Garden', 1.00),
       ('Pets', .75),
       ('Clothing', .60),
       ('Health & Style', .85);

insert into bamazon.products (department_id, name, price, quantity)
values (1, 'Tamagotchi', 19.99, 100),
       (1, 'Playstaion 4', 299.99, 50),
       (2, 'Yankee Candle', 9.99, 25),
       (2, 'Throw Pilow', 14.99, 10),
       (3, 'Chew Toy', 12.99, 25),
       (3, 'Dry Kibble', 9.99, 30),
       (4, 'Talylor Swift Graphic Tee', 19.99, 10),
       (4, 'Sweet Jorts', 39.99, 50),
       (5, 'Toothpaste', 5.99, 25),
       (5, 'Beard Oil', 7.99, 40);

