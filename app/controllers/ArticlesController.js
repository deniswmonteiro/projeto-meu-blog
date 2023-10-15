const express = require("express");
const router = express.Router();

router.get("/artigos", (req, res) => {
    res.send("Artigos");
});

/** Create a article */
router.get("/admin/artigos/criar", (req, res) => res.render("admin/articles/create"));

module.exports = router