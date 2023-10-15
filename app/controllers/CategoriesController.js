const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Category = require("../models/Category");

/** Categories list */
router.get("/admin/categorias", (req, res) => {
    Category.findAll({ raw: true })
        .then((categories) => {
            res.render("admin/categories/index", {
                page: "categories",
                categories
            });
        });
});

/** Create a category */
router.get("/admin/categorias/criar", (req, res) => {
    res.render("admin/categories/create", {
        page: "categories"
    });
});

/** Store a created category */
router.post("/admin/categorias/salvar", (req, res) => {
    const title = req.body.title;

    if (title || title.trim() !== "") {
        Category.create({
            title,
            slug: slugify(title).toLowerCase()
        }).then(() => res.redirect("/admin/categorias"));
    }

    else res.redirect("/admin/categorias/criar");
});

/** Edit a category */
router.get("/admin/categorias/editar/:id", (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) res.redirect("/admin/categorias");

    else {
        Category.findByPk(id)
            .then((category) => {
                if (category) res.render("admin/categories/edit", { category });
                else res.redirect("/admin/categorias");
            })
            .catch((error) => res.redirect("/admin/categorias"));
    }
});

/** Update a category */
router.post("/admin/categorias/atualizar", (req, res) => {
    const id = req.body.categoryId;
    const title = req.body.title;

    if (title || title.trim() !== "") {
        Category.update({
            title,
            slug: slugify(title).toLowerCase()
        }, {
            where: {
                id
            }
        }).then(() => res.redirect("/admin/categorias"));
    }

    else res.redirect(`/admin/categorias/editar/${id}`);
});

/** Delete a category */
router.post("/admin/categorias/excluir", (req, res) => {
    const id = req.body.categoryId;

    if (id && !isNaN(id)) {
        Category.destroy({
            where: {
                id
            }
        }).then(() => res.redirect("/admin/categorias"));
    }

    else res.redirect("/admin/categorias");
});


module.exports = router