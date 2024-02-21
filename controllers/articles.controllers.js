const {fetchAllArticles, fetchArticleById, changeArticleById} = require("../models/articles.models");

const getAllArticles = (request, response, next) => { 
    fetchAllArticles().then((articles) => { 
        response.status(200).send({articles})
    })
};

const getArticleById = (request, response, next) => { 
    const { article_id } = request.params;
    fetchArticleById(article_id).then((article) => { 
        response.status(200).send({article})
    })
}
const updateArticleById = (request, response, next) => { 
    console.log("hi")
    const { inc_vote } = request.body
    const { article_id } = request.params
    changeArticleById(inc_votes, article_id).then((article) => {
        response.status(200).send({article})
    })
}

module.exports ={ getAllArticles, getArticleById, updateArticleById}