const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User");

router.get("/admin/usuarios", (req, res) => {
    res.send("Usuários");
});

/** Create a user */
router.get("/admin/usuarios/criar", (req, res) => {
    res.render("admin/users/create", {
        role: "admin",
        page: "user"
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
                .then(() => res.redirect("/"))
                .catch((error) => res.redirect("/"));
            }

            else res.redirect("/admin/usuarios/criar");
        });
    }

    else res.redirect("/admin/usuarios/criar");
});

User.sync({ force: false });

module.exports = router