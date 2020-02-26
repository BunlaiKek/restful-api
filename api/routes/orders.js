const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");


router.get("/", (req, res, next) => {
    Order.find().select("product quantity _id").exec().then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    quantity: order.quantity,
                    product: order.product,
                    _id: order._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/orders/' + order._id
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

    Product.findById(req.body.productId).exec().then(product => {

            if (product) {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return order.save()
            }
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order created successfully",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: "GET",
                        url: "localhost:3000/orders/" + result._id
                    }

                }
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        });
});

router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "Order details",
        order_id: req.params.orderId
    });
});

router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "Order deleted",
        order_id: req.params.orderId
    });
});
module.exports = router;