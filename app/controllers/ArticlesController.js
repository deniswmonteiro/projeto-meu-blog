const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Article = require("../models/Article");
const Category = require("../models/Category");

/** Articles list */
router.get("/admin/artigos", (req, res) => {
    Article.findAll({
        raw: true,
        include: [{ 
            model: Category
        }],
        order: [
            [ "id", "desc" ]
        ]
    }).then((articles) => {
        res.render("admin/articles/index", {
            role: "admin",
            page: "articles",
            articles
        })
    });
});

/** Create a article */
router.get("/admin/artigos/criar", (req, res) => {
    Category.findAll({ raw: true })
        .then((categories) => {
            res.render("admin/articles/create", {
                role: "admin",
                page: "articles",
                categories
            })
        });
});

/** Store a article */
router.post("/admin/artigos/salvar", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;

    if (title && title.trim() !== "" && content && content.trim() !== "" && category && category.value !== 0) {
        Article.create({
            title,
            slug: slugify(title).toLowerCase(),
            content,
            categoryId: category
        })
        .then(() => res.redirect("/admin/artigos"))
        .catch((error) => res.redirect("/"));
    }

    else res.redirect("/admin/artigos");
});

/** Edit a article */
router.get("/admin/artigos/editar/:id", (req, res) => {
    const id = req.params.id;

    if (id && !isNaN(id)) {
        Article.findOne({
            where: {
                id
            },
            include: [{ 
                model: Category
            }],
        }).then((article) => {
            Category.findAll({ raw: true }).then((categories) => {
                res.render("admin/articles/edit", {
                    role: "admin",
                    page: "article",
                    article,
                    categories
                });
            });
        });
    }

    else res.redirect("/admin/artigos");
});

/** Update a article */
router.post("/admin/artigos/atualizar", (req, res) => {
    const id = req.body.articleId;
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;

    if (title && title.trim() !== "" && content && content.trim() !== "" && category && category.value !== 0) {
        Article.update({
            title,
            slug: slugify(title).toLowerCase(),
            content,
            categoryId: category
        }, {
            where: {
                id
            }
        })
        .then(() => res.redirect("/admin/artigos"))
        .catch((error) => res.redirect("/"));
    }

    else res.redirect("/")
});

/** Delete a article */
router.post("/admin/artigos/excluir", (req, res) => {
    const id = req.body.articleId;

    if (id && !isNaN(id)) {
        Article.destroy({
            where: {
                id
            }
        }).then(() => res.redirect("/admin/artigos"));
    }

    else res.redirect("/admin/artigos");
});

module.exports = router