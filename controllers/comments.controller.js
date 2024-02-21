const {fetchCommentsByArticleId, addCommentByArticleId} = require("../models/comments.model");

const getCommentsByArticleId = (request, response, next) => { 
    const { article_id } = request.params
    fetchCommentsByArticleId(article_id).then((comments) => { 
        response.status(200).send({comments})
    })
};

const postCommentByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const newComment = request.body
    addCommentByArticleId(article_id, newComment).then((comment) => { 
        response.status(201).send({newComment: comment})
    })
} 

module.exports = {getCommentsByArticleId, postCommentByArticleId}