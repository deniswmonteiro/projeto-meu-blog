const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Article = require("../models/Article");
const Category = require("../models/Category");

router.get("/admin/artigos", (req, res) => {
    res.send("Artigos");
});

/** Create a article */
router.get("/admin/artigos/criar", (req, res) => {
    Category.findAll()
        .then((categories) => res.render("admin/articles/create", { categories }));
});

/** Store a article */
router.post("/admin/artigos/salvar", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;

    Article.create({
        title,
        slug: slugify(title).toLowerCase(),
        content,
        categoryId: category
    }).then(() => res.redirect("/admin/artigos"));
});

module.exports = router