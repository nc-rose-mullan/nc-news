const db = require("../db/connection")

const fetchAllArticles = () => { 
    return db.query(`
    SELECT articles.author, title, articles.article_id,topic, articles.created_at, articles.votes, articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INT)
    AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`).then(({ rows }) => { 
        return rows
    })
};

const fetchArticleById = (id) => { 
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => { 
        return rows[0]
    })
} 

const changeArticleById = (vote, id) => { 
    console.log("in here")
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *`, [vote, id]).then(({ rows }) => { 
        return rows
    })
}

module.exports = {fetchAllArticles, fetchArticleById, changeArticleById}