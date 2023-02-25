module.exports = app => {
    const customers = require("../controllers/customer.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all customers
    router.get("/", customers.findAll);

     // Retrieve all customers
     router.get("/report", customers.findAllCustomerReport);
  
    // Retrieve a single customer with id
    router.get("/:id", customers.findOne);

    // Retrieve a single token with id
    router.get("/token/:id", customers.generateToken);

    // Update a customer with id
    router.put("/:id", customers.update);
  
    app.use('/api/customers', router);
  };