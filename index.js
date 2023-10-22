const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./database/connection");

/** Controllers */
const AuthController = require("./app/controllers/AuthController");
const CategoriesController = require("./app/controllers/CategoriesController");
const ArticlesController = require("./app/controllers/ArticlesController");
const UsersController = require("./app/controllers/UsersController");

/** Models */
const Article = require("./app/models/Article");
const Category = require("./app/models/Category");
const User = require("./app/models/User");

/** View engine */
app.set("view engine", "ejs");

/** Session */
app.use(session({
    secret: "l+/mcr4RgxP7MWrQ8rJN6qPViobXq9OiwEPxrTXRQz4=",
    cookie: {
        maxAge: 86400000  // 1 day
    }
}));

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
app.use("/", AuthController);
app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

// Home page
app.get("/", (req, res) => {
    Article.findAll({
            raw: true,
            order: [
                [ "id", "desc" ]
            ],
            limit: 5
        }).then((articles) => {
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

/** Articles pagination */
app.get("/artigos/:id", (req, res) => {
    const page = Number(req.params.id);

    if (page === 0) res.redirect("/");
    
    else {
        let limit = 5;
        let offset = 0;

        if (isNaN(page) || page === 1) offset = 0;
        else offset = (page - 1) * limit;

        Article.findAndCountAll({
            order: [
                ["id", "desc"]
            ],
            limit,
            offset
        }).then((articles) => {
            const hasNextPage = (offset + limit) <= articles.count ? true : false;
            const totalPages = Math.round(articles.count / limit);

            const result = {
                page,
                totalPages,
                articles,
                next: hasNextPage
            }

            if (page > totalPages) res.redirect("/artigos/1");

            else {
                Category.findAll({ raw: true }).then((categories) => {
                    res.render("page", {
                        role: "user",
                        page: "article",
                        result,
                        categories
                    });
                });
            }
        });
    }
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

app.listen(3000, () => console.log("Servidor em execução."));