const request = require('supertest');
const endpoints = require('../endpoints.json');
const app = require('../app');
const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

beforeEach(() => { 
   return seed(data)
})

afterAll(() => {
   return db.end()
 })

describe('/api', () => { 
    test("returns list of endpoints", () => { 
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => { 
                expect(typeof body.endpoints).toBe('object')
                expect(Array.isArray(body.endpoints)).toBe(false)
                for (let key in body.endpoints) { 
                    expect(typeof endpoints[key].description).toBe("string")
                    expect(typeof endpoints[key].queries).toBe('object')
                    expect(Array.isArray(endpoints[key].queries)).toBe(true)
                    expect(endpoints[key].hasOwnProperty('exampleResponse')).toBe(true)
                }
            })
    })
});

describe('/api/articles', () => {
    test('list of articles', () => { 
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => { 
                expect(articles.length).toBe(13)
                articles.forEach((article) => { 
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        article_img_url: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
    test('articles are sorted by date descending', () => { 
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => { 
                expect(articles).toBeSortedBy('created_at', {descending: true})
            })
    })
 })
describe('/api/topics', () => {
    test('list of topics', () => { 
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => { 
                expect(topics.length).toBe(3)
                topics.forEach((topic) => { 
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
            })
    })
});

describe('/api/articles/:article_id/comments', () => { 
    test('returns an array of all comments for an article', () => { 
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => { 
            expect(comments.length).toBe(11)
            comments.forEach((comment) => { 
               expect(comment).toMatchObject({
                   comment_id: expect.any(Number),
                   votes: expect.any(Number),
                   created_at: expect.any(String),
                   author: expect.any(String),
                   body: expect.any(String),
                   article_id: 1   
                })
            })
        })
    })
});

describe('POST /api/articles/:article_id/comments', () => { 
    test('returns new comment when added', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: 'butter_bridge',
            body: "tufty is cool"
        })
        .expect(201)
            .then(({ body: {newComment} }) => {
            expect(newComment).toMatchObject({
                comment_id: 19,
                body: "tufty is cool",
                article_id: 2,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
            })
         })
    })
});

describe("article by id", () => {
    test("article by id", () => {
        return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toMatchObject({
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                created_at: `2020-10-16T05:03:00.000Z`,
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
})