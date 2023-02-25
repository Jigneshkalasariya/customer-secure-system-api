const db = require("../models");
const Customer = db.customers;
const Customer_Report = db.customer_reports;
var jwt = require('jsonwebtoken');

// Retrieve all customers from the database.
exports.findAll = (req, res) => {
    Customer.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};


// Retrieve all customers-report from the database.
exports.findAllCustomerReport = (req, res) => {
    Customer_Report.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};

// Find a single customer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    let jwtSecretKey = 'CUSTOMERSECRETSYSTEM123456789';
    try {
        const verified = jwt.verify(id, jwtSecretKey);
        if (verified) {
            Customer.findById(verified.id)
                .then(data => {
                    if (!data)
                        res.status(404).send({ message: "Not found Customer with id " + id });
                    else {
                        Customer_Report.findOne({ 'token': req.params.id })
                            .then(result => {
                                if (result) {
                                    result.open_link++;
                                    Customer_Report.findByIdAndUpdate(result.id, result, { useFindAndModify: false })
                                        .then(result => {
                                            res.send(result);
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message: "Error updating Customer with id=" + id
                                            });
                                        });
                                }
                                else {
                                    const customer_report = new Customer_Report({
                                        cust_id: data.id,
                                        old_name: data.name,
                                        old_phone: data.phone,
                                        old_address: data.address,
                                        token: req.params.id,
                                        open_link: 1,
                                        new_name: '',
                                        new_phone: '',
                                        new_address: '',
                                    });
                                    customer_report
                                        .save(customer_report)
                                        .then(result => {
                                            res.send(result);
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message:
                                                    err.message || "Some error occurred while creating the customer report."
                                            });
                                        });
                                }
                            }).catch(err => {
                                console.log(err)
                                res
                                    .status(500)
                                    .send({ message: "Error retrieving Customer with id=" + id });
                            });;

                    };
                })
                .catch(err => {
                    console.log(err)
                    res
                        .status(500)
                        .send({ message: "Error retrieving Customer with id=" + id });
                });
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }

};


// Generating JWT
exports.generateToken = (req, res) => {
    const id = req.params.id;

    let jwtSecretKey = 'CUSTOMERSECRETSYSTEM123456789';
    let data = {
        id: id,
    }

    const token = jwt.sign(data, jwtSecretKey, { expiresIn: 60 * 10 });
    return res.status(200).send({
        data: token
    });
};

// Update a customer by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Customer_Report.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Customer with id=${id}. Maybe Customer was not found!`
                });
            } else res.send({ message: "Customer was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Customer with id=" + id
            });
        });
};