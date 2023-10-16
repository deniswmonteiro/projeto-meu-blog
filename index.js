const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");

/** Controllers */
const CategoriesController = require("./app/controllers/CategoriesController");
const ArticlesController = require("./app/controllers/ArticlesController");

/** Models */
const Article = require("./app/models/Article");
const Category = require("./app/models/Category");

/** View engine */
app.set("view engine", "ejs");

/** Static files location */
app.use(express.static("public"));

/** Body Parser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** DB connection */
connection.authenticate()
    .then(() => console.log("Conexão feita com sucesso."))
    .catch((error) => console.log(error));

/** Routes */
// Home page
app.get("/", (req, res) => {
    Article.findAll({
            raw: true,
            order: [
                [ "id", "desc" ]
            ]
        })
        .then((articles) => {
            Category.findAll({ raw: true }).then((categories) => {
                res.render("index", {
                    role: "user",
                    page: "home",
                    articles,
                    categories
                });
            });
        });
});

// Article page
app.get("/:slug", (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: {
            slug
        }
    }).then((article) => {
        if (article) {
            Category.findAll({ raw: true }).then((categories) => {
                res.render("article", {
                    role: "user",
                    page: "article",
                    article,
                    categories
                });
            });
        }

        else res.redirect("/");
    }).catch((error) => {
        res.redirect("/");
    });
});

// Category page
app.get("/categorias/:slug", (req, res) => {
    const slug = req.params.slug;

    Category.findOne({
        where: {
            slug
        },
        include: [{
            model: Article
        }]
    }).then((category) => {
        if (category) {
            Category.findAll({ raw: true }).then((categories) => {
                res.render("category", {
                    role: "user",
                    page: slug,
                    articles: category["articles"],
                    categories,
                    category
                });
            });
        }

        else res.redirect("/");
    }).catch((error) => {
        res.redirect("/");
    });
});

app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.listen(3000, () => console.log("Servidor em execução."));