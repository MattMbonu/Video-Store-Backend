const express = require("express");
const router = express.Router();

//GET requests
router.get("/", (req, res) => {
  res.send("Hello Video peeps");
});

module.exports = router;
