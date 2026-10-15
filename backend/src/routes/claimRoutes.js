const express = require("express");
const { createClaim, getClaims, updateClaim } = require("../controllers/claimController");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/items/:itemId/claims", protect, createClaim);
router.get("/items/:itemId/claims", protect, getClaims);
router.patch("/claims/:id", protect, updateClaim);

module.exports = router;
// Express.js route example
app.get('/api/claims/:id/evidence', authMiddleware, async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate('itemId');
  if (!claim) return res.status(404).json({ message: 'Claim not found' });

  // Only item owner can view private evidence
  if (claim.itemId.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  return res.status(200).json({
    evidenceText: claim.evidenceText,
    evidenceUrl: claim.evidenceUrl
  });
});