const Sequelize = require("sequelize");
const connection = require("../../database/connection");
const Category = require("./Category");

const Article = connection.define("article", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

/** Relationship: 1-1 */
Article.belongsTo(Category);

/** Relationship: 1-n */
Category.hasMany(Article);

module.exports = Article