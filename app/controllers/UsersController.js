const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User");

/** Users list */
router.get("/admin/usuarios", (req, res) => {
    User.findAll({ raw: true })
        .then((users) => {
            res.render("admin/users/index", {
                role: "admin",
                page: "users",
                users
            });
        });
});

/** Create a user */
router.get("/admin/usuarios/criar", (req, res) => {
    res.render("admin/users/create", {
        role: "admin",
        page: "users"
    });
});

/** Store a category */
router.post("/admin/usuarios/salvar", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (name && name.trim() !== "" && email && email.trim() !== "" && password && password.trim() !== "") {
        User.findOne({
            where: {
                email
            }
        }).then((user) => {
            if (!user) {
                const salt = bcryptjs.genSaltSync(6);

                User.create({
                    name,
                    email,
                    password: bcryptjs.hashSync(password, salt)
                })
                .then(() => res.redirect("/admin/usuarios"))
                .catch((error) => res.redirect("/"));
            }

            else res.redirect("/admin/usuarios/criar");
        });
    }

    else res.redirect("/admin/usuarios/criar");
});

/** Delete a category */
router.post("/admin/usuarios/excluir", (req, res) => {
    const id = req.body.userId;

    if (id && !isNaN(id)) {
        User.destroy({
            where: {
                id
            }
        }).then(() => res.redirect("/admin/usuarios"));
    }

    else res.redirect("/admin/usuarios");
});

User.sync({ force: false });

module.exports = router