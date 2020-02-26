const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require('../models/product');



router.get("/", (req, res, next) => {

    Product.find().select("name price _id").exec().then(products => {
        const response = {
            count: products.length,
            products: products.map(prod => {
                return {
                    name: prod.name,
                    price: prod.price,
                    _id: prod._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + prod._id
                    }
                }
            })
        };
        res.status(200).json(response)

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.post("/", (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });

    });
});


router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select("_id name price").exec().then(product => {
        console.log(product);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({
                message: "No product found for provided ID"
            });
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});


router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated!",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            });

        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({
        _id: id
    }).exec().then(result => {
        console.log(result);

        res.status(200).json({
            message: "Product deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/products",
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })

    });
});
module.exports = router;