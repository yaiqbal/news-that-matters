const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleById, 
        getArticles, getCommentsById, postComment, 
        patchArticleController, deleteCommentByIdController, 
        getUsers,
    } = require('./controllers/news.controller');

const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsById);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticleController);

app.delete('/api/comments/:comment_id', deleteCommentByIdController);

app.get('/api/users', getUsers);

app.all('/*', (req,res) => {
    res.status(404).send({ msg: 'Invalid endpoint' });
})

app.use((err, req, res, next) => {
      if((err.code === "22P02") || (err.code === "23502")) {
         res.status(400).send({ msg: 'Bad request' });
      } else if (err.code === "23503") {
        res.status(404).send({ msg: 'Input parameter not found' });
      } else {
        res.status(400).send({ msg: 'Error occurred', err : err.code });
      }
});

module.exports = app;
