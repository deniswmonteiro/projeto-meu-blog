const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

/** Middlewares */
const adminAuth = require("../../middlewares/adminAuth");

/** Models */
const User = require("../models/User");

/** Users list */
router.get("/admin/usuarios", adminAuth, (req, res) => {
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
router.get("/admin/usuarios/criar", adminAuth, (req, res) => {
    res.render("admin/users/create", {
        role: "admin",
        page: "users"
    });
});

/** Store a user */
router.post("/admin/usuarios/salvar", adminAuth, (req, res) => {
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

/** Edit a user */
router.get("/admin/usuarios/editar/:id", adminAuth, (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) res.redirect("/admin/usuarios");
    
    else {
        User.findOne({
            where: {
                id
            }
        }).then((user) => {
            res.render("admin/users/edit", {
                role: "admin",
                page: "users",
                user
            });
        }).catch((error) => res.redirect("/admin/usuarios"));
    }
});

/** Update a user */
router.post("/admin/usuarios/atualizar", adminAuth, (req, res) => {
    const id = req.body["user-id"];
    const name = req.body.name;
    const email = req.body.email;
    const changePassword = req.body["change-password"];
    const password = changePassword ? req.body.password : null;

    if (changePassword === "on" && password.trim() === "") res.redirect(`/admin/usuarios/editar/${id}`);

    else {
        if (name && name.trim() !== "" && email && email.trim() !== "") {
            if (password === null) {
                User.update({
                    name,
                    email
                }, {
                    where: {
                        id
                    }
                }).then(() => res.redirect("/admin/usuarios"));
            }

            else {
                const salt = bcryptjs.genSaltSync(6);

                User.update({
                    name,
                    email,
                    password: bcryptjs.hashSync(password, salt)
                }, {
                    where: {
                        id
                    }
                }).then(() => res.redirect("/admin/usuarios"));
            }
        }

        else res.redirect(`/admin/usuarios/editar/${id}`);
    }
});

/** Delete a user */
router.post("/admin/usuarios/excluir", adminAuth, (req, res) => {
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