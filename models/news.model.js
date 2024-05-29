const { read } = require("fs");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
  .then((result) => {
    return result.rows;
  })
  .catch((err) => {
    throw err
  })
};