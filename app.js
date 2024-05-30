const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsById } = require('./controllers/news.controller');

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsById);

app.all('/*', (req,res) => {
    res.status(404).send({ msg: 'Invalid endpoint' });
})

app.use((err, req, res, next) => {
      if(err.code === "22P02") {
         res.status(400).send({ msg: 'Bad request' });
      }
});

module.exports = app;
