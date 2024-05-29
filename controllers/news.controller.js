const { selectTopics } = require("../models/news.model");
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
