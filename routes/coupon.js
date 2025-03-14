const express = require("express");
const Coupon = require("../models/Coupon");
const router = express.Router();

const claimedCoupons = new Map();

// ✅ Test Route to check if this file is loading correctly
router.get("/test", (req, res) => {
    res.send("✅ Coupon API is working!");
});

// 🚀 Coupon Claim API
router.post("/claim", async (req, res) => {
    const userIP = req.ip;
    const userCookie = req.cookies?.claimed || false;

    // Prevent abuse using IP tracking and cookies
    if (claimedCoupons.has(userIP) || userCookie) {
        return res.status(429).json({ message: "You have already claimed a coupon. Try again later." });
    }

    // Find next available coupon
    const coupon = await Coupon.findOneAndUpdate({ isClaimed: false }, { isClaimed: true });

    if (!coupon) {
        return res.status(400).json({ message: "No more coupons available!" });
    }

    // Store IP and set cookie
    claimedCoupons.set(userIP, Date.now());
    res.cookie("claimed", "true", { maxAge: 3600000, httpOnly: true });

    res.json({ message: "Coupon claimed successfully!", coupon: coupon.code });
});

module.exports = router;
