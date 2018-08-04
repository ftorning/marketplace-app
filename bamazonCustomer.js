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
        if (parseInt(answer.quantity) > product.quantity) {
            console.log(".... I just said we have " + product.quantity + " of " + product.name + " in stock.");
            return quantityPrompt(product);
        }
        return confirmOrder(product, answer.quantity);
    });
}

function confirmOrder(product, quantity) {
    updateProduct(product, quantity).then(function(answer) {
        console.log("Okay, done - " + quantity + " of " + product.name + " purchased!")
        userPrompt();
    })
}
    
    //   case "Find all artists who appear more than once":
    //     multiSearch();
    //     break;

    //   case "Find data within a specific range":
    //     rangeSearch();
    //     break;

    //   case "Search for a specific song":
    //     songSearch();
    //     break;

    //   case "Find artists with a top song and top album in the same year":
    //     songAndAlbumSearch();
    //     break;
    //   }
    // });


// function artistSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist: answer.artist }, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//         }
//         runSearch();
//       });
//     });
// }

// function multiSearch() {
//   var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     runSearch();
//   });
// }

// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }

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
        connection.query(query, [parseInt(product.id), (parseInt(product.quantity) - parseInt(quantity))], function(err, res) {
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
        // console.log("Item Number\t\t|| Item Name\t\t|| Price\t\t|| Department");
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
    

