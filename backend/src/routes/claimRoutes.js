const express = require("express");
const { createClaim, getClaims, updateClaim } = require("../controllers/claimController");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/items/:itemId/claims", protect, createClaim);
router.get("/items/:itemId/claims", protect, getClaims);
router.patch("/claims/:id", protect, updateClaim);

module.exports = router;