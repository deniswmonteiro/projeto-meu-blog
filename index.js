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
app.get("/", (req, res) => {
    Article.findAll({ raw: true })
        .then((articles) => {
            res.render("index", {
                page: "home",
                articles
            });
        });
});

app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.listen(3000, () => console.log("Servidor em execução."));