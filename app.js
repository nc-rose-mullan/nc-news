const express = require('express');
const {getAllArticles, getArticleById, updateArticleById} = require('./controllers/articles.controllers');
const getTopics = require('./controllers/topics.controller');
const {getCommentsByArticleId, postCommentByArticleId} = require('./controllers/comments.controller');
const app = express();

app.use(express.json())

app.get('/api', (req, res, next) => { 
    const endpoints = require('./endpoints.json')
    res.status(200).send({endpoints})
})

app.get('/api/articles', getAllArticles)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)
app.patch('/api/articles/:article_id', updateArticleById)
app.get('/api/articles/:article_id', getArticleById)

app.use((err, request, response, next) => { 
    if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg });
    } else { 
        next(err)
    }
})

app.use((err, request, response, next) => { 
    if (err.code === '22P02') { 
        response.status(400).send({msg: "bad request"})
    }
})

module.exports = app