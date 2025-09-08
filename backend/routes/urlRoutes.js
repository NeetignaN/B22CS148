const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createUrl,
  redirectUrl,
  getUserUrls,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", protect, createUrl);
router.get("/:urlCode", redirectUrl);
router.get("/", protect, getUserUrls);

module.exports = router;
