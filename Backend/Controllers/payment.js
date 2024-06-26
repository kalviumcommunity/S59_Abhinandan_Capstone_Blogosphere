require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const generateReceiptOrderID = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post("/orders", async (req, res) => {

    const amount  = req.body.amount;

    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_order_${generateReceiptOrderID()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } 
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router