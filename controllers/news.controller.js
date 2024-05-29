const { selectTopics, selectArticleById } = require("../models/news.model");
const endpointData =  require(`${__dirname}/../endpoints.json`)

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
};

exports.getEndpoints = (req, res, next) => {
  return res.status(200).send({endpointData});
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((articles) => {
      if (!articles.length) {
        return res.status(404).send({ msg: 'Article does not exist' });
      }
      res.status(200).send({ articles });
    })
    .catch((err) => {
      if(err.code === "22P02") {
        res.status(400).send({ msg: 'Bad request' });
      }
    })
};