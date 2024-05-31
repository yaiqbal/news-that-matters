const { read } = require("fs");
const db = require("../db/connection");
const { log } = require("console");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  const queryStr = `SELECT 
  A.author, A.title, A.article_id, A.topic, 
  A.created_at, A.votes, A.article_img_url, 
  COUNT(C.article_id) AS comment_count, A.body 
  FROM articles A 
  JOIN comments C
  ON A.article_id = C.article_id 
  WHERE A.article_id = $1
  GROUP BY C.article_id, A.article_id 
  ORDER BY A.created_at DESC;`;

  return db
    .query(queryStr, [article_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectArticles = (topic) => {
  if (!topic) {
    const queryStr = `SELECT 
                    A.author, A.title, A.article_id, A.topic, 
                    A.created_at, A.votes, A.article_img_url, 
                    COUNT(C.article_id) AS comment_count 
                    FROM articles A 
                    LEFT JOIN comments C 
                    ON A.article_id = C.article_id 
                    GROUP BY C.article_id, A.article_id 
                    ORDER BY A.created_at DESC;`;
    return db
      .query(queryStr)
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        throw err;
      });
  } else {
    const queryStr = `SELECT 
                    author, title, article_id, topic, 
                    created_at, votes, article_img_url,
                    body
                    FROM articles 
                    WHERE topic = $1;`;
    return db
      .query(queryStr, [topic])
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        throw err;
      });
  }
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

exports.insertComment = ({ username, body }, article_id) => {
  const queryStr = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`;
  return db
    .query(queryStr, [username, body, article_id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.patchArticleModel = ({ inc_votes }, article_id) => {
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  return db
    .query(queryStr, [inc_votes, article_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.deleteCommentByIdModel = (comment_id) => {
  const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  return db
    .query(queryStr, [comment_id])
    .then((result) => {
      return result.rowCount;
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectUsers = () => {
  const strQuery = `SELECT * FROM users;`;
  return db.query(strQuery).then((result) => {
    return result.rows;
  });
};
