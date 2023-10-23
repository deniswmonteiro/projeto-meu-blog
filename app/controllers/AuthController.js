const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

/** Middlewares */
const adminAuth = require("../../middlewares/adminAuth");

/** Models */
const User = require("../models/User");

/** Login */
router.get("/login", (req, res) => {
    res.render("login", {
        page: "login"
    });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && email.trim() !== "" && password && password.trim() !== "") {
        User.findOne({
            where: {
                email
            }
        }).then((user) => {
            if (user) {
                const passwordMatch = bcryptjs.compareSync(password, user.password);

                if (passwordMatch) {
                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }

                    res.redirect("/");
                }

                else res.redirect("/login"); 
            }

            else res.redirect("/login");
        });
    }

    else res.redirect("/login");
});

/** Logout */
router.get("/admin/logout", adminAuth, (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router