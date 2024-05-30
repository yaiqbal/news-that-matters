const { read } = require("fs");
const db = require("../db/connection");
//const checkExists = require("../utils");
//const format = require('pg-format');

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectArticles = () => {
  const queryStr = `SELECT 
                    A.author, A.title, A.article_id, A.topic, 
                    A.created_at, A.votes, A.article_img_url, 
                    COUNT(C.article_id) AS comment_count 
                    FROM articles A 
                    LEFT JOIN comments C 
                    ON A.article_id = C.article_id 
                    GROUP BY C.article_id, A.article_id 
                    ORDER BY A.created_at DESC;`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.selectCommentsById = (article_id) => {
  const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;

  return db.query(queryStr, [article_id]).then((result) => {
    return result.rows;
  });
};
exports.checkArticleExists = (article_id) => {
  const queryStr = `SELECT 1 FROM articles WHERE article_id = $1;`;
  return db.query(queryStr, [article_id]).then((result) => {
    return result.rowCount > 0;
  });
};
