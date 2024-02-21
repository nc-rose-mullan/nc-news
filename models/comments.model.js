const db = require('../db/connection')
const {convertTimestampToDate} = require('../db/seeds/utils')

const fetchCommentsByArticleId = (id) => { 
    return db.query(`SELECT * FROM comments WHERE article_id=$1`, [id]).then(({ rows }) => { 
        return rows
    })
};

const addCommentByArticleId = (id, newComment) => {
    newComment.article_id = id
    newComment.created_at = convertTimestampToDate({ created_at: Date.now() }).created_at
    return db.query(`INSERT INTO comments(body, votes, author, created_at, article_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [newComment.body, 0, newComment.username, newComment.created_at, id]).then(({rows}) => { 
        return rows[0]
    })
}

module.exports = {fetchCommentsByArticleId, addCommentByArticleId}