// Actual program
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  userPrompt();
});

function userPrompt() {
    getProducts().then(function(products) {
        showProducts(products);
        inquirer.prompt({
            name: "product",
            type: "input",
            message: "What product would you like to purchase?",
        }).then(function(answer) {
            for (let i = 0; i < products.length; i++) {
                if (parseInt(answer.product) === products[i].id) {
                    return quantityPrompt(products[i]);
                }
            }
            console.log(answer.product + " is not a product id\n\n");
            return userPrompt();
        });
    });
}

function quantityPrompt(product) {
    inquirer.prompt({
        name: "quantity",
        type: "input",
        "message": "We currently have " + product.quantity + " available. How many would you like to purchase?",
    }).then(function(answer) {
        var userQuantity = parseInt(answer.quantity);
        if (userQuantity > product.quantity) {
            console.log(".... I just said we have " + product.quantity + " of " + product.name + " in stock.");
            return quantityPrompt(product);
        }
        updateProduct(product, userQuantity).then(function(answer) {
            return confirmOrder(product, userQuantity);    
        })
        
    });
}

function confirmOrder(product, quantity) {
    console.log("Okay, done - " + quantity + " of " + product.name + " purchased!");
    console.log("Your total is $" + (parseInt(quantity) * (parseFloat(product.price))));
    userPrompt();
    
}
    
function getProducts() {
    return new Promise(function(resolve, reject) {
        var query = "select p.id as id, p.name as name, p.price as price, d.name as department, p.quantity as quantity "    
        query += "from products p join departments d on p.department_id = d.id where p.quantity > 0 order by p.id"
        connection.query(query, function(err, res) {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    });
};

function updateProduct(product, quantity) {
    return new Promise(function(resolve, reject) {
        var query = "update products set quantity = ? where id = ?";
        var updatedQuantity = parseInt(product.quantity) - parseInt(quantity);
        var intProductId = parseInt(product.id);
        connection.query(query, [updatedQuantity, intProductId], function(err, res) {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    });
};

function showProducts(res) {
    console.log(res.length + " matches found!");
    for (var i = 0; i < res.length; i++) {
        console.log("Product No.: " + res[i].id + 
                    " || Product: " + res[i].name + 
                    " || Price: " + res[i].price + 
                    " || Dept: " + res[i].department);
    }
};

function handleError(err) {
    console.log("Error encountered: " + err);
    userPrompt();
}
    

