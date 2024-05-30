const {
  selectTopics,
  selectArticleById,
  selectArticles,
  checkArticleExists,
  selectCommentsById,
  insertComment
} = require("../models/news.model");
const endpointData = require(`${__dirname}/../endpoints.json`);

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpointData });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (!article.length) {
        res.status(404).send({ msg: "Article does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleExists(article_id)
    .then((articleExists) => {
      if (!articleExists) {
        res.status(404).send({ msg: "Article not found" });
      }
      return selectCommentsById(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const newComment = req.body
  const {article_id} = req.params

  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({comment})
    })
    .catch((err) => {
      next(err)
    })

}