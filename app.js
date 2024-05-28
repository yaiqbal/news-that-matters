const express = require('express');
const app = express();
const { getTopics } = require('./controllers/news.controller');

app.get('/api/topics', getTopics);

module.exports = app;
