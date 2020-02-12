const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Order were fetched"
    })
});

router.post("/", (req, res, next) => {
    res.status(201).json({
        message: "Order was created"
    })
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