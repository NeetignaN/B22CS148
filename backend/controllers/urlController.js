const Url = require("../models/urlModel");
const { nanoid } = require("nanoid");

const createUrl = async function (req, res) {
  try {
    const { longUrl, customCode } = req.body;

    if (!longUrl)
      return res.status(400).json({ message: "Please provide a long URL" });

    let urlCode = customCode || nanoid(7);

    // Check for duplicate code
    const codeExists = await Url.findOne({ urlCode });
    if (codeExists) {
      return res.status(400).json({
        message: "Custom code already in use. Please choose another.",
      });
    }

    // Optional: Prevent duplicate longUrl for the same user
    const urlExists = await Url.findOne({ longUrl, owner: req.user.id });
    if (urlExists) {
      return res
        .status(400)
        .json({ message: "You have already shortened this URL." });
    }

    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    const url = await Url.create({
      longUrl,
      shortUrl,
      urlCode,
      owner: req.user.id,
    });

    res.status(201).json(url);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const redirectUrl = async function (req, res) {
  try {
    const { urlCode } = req.params;
    const url = await Url.findOne({ urlCode });

    if (!url) return res.status(401).json({ message: "URL not found!" });

    url.clicks++;
    await url.save();

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserUrls = async function (req, res) {
  try {
    const urls = await Url.find({ owner: req.user.id });
    res.status(201).json(urls);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createUrl, redirectUrl, getUserUrls };
