const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require('./controllers/news.controller');

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.all('/*', (req,res) => {
    res.status(404).send({ msg: 'Invalid endpoint' });
})

module.exports = app;
