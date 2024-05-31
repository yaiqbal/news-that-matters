const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/');
const endpointDataFromJson =  require(`${__dirname}/../endpoints.json`)
const { expect } = require('@jest/globals');
require('jest-sorted');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
    test('GET:200 sends an array of topics to the client', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
          response.body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
          });
        });
    });
})

describe('/api/invalid-endpoint', () => {
  test('GET:404 for invalid endpoint', () => {
    return request(app)
      .get('/api/invalid-endpoint')
      .expect(404)
      .then((response) => {
          expect(response.body.msg).toBe('Invalid endpoint');
      });
  });
})

describe('/api', () => {
  test('GET:200 Responds with an object describing all the available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
          const data = response.body.endpointData
          const expectedOutput = endpointDataFromJson
          expect(data).toEqual(expectedOutput)
      });
  });
})

describe('/api/articles/:article_id', () => {
  test('GET:200 Responds with an article object, which should have all the article properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
          const article = response.body.article[0]
          expect(response.body.article.length).toBe(1);
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url : expect.any(String)
          })
          expect(typeof parseInt(article.comment_count)).toBe('number');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/not-a-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
})

describe('/api/articles', () => {
  test('GET:200 Responds with all articles (articles array) of all article objects when topic is specified', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
          expect(response.body.articles.length).toBe(13);
          expect(response.body.articles).toBeSortedBy('created_at', {descending: true });
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url : expect.any(String)
          })
          expect(typeof parseInt(article.comment_count)).toBe('number');
          expect(article).not.toHaveProperty('body'); 
        });
      });
  });
  test('GET:200 Responds with specific articles (articles array) of article objects when topic is specified', () => {
    const topic = "mitch"
    return request(app)
      .get('/api/articles')
      .query({topic})
      .expect(200)
      .then((response) => {
          expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url : expect.any(String),
            body: expect.any(String)
          })
          expect(article.topic).toBe(topic)
        });
      });
  });
  test('GET:404 sends an appropriate status and error message when queried for non-existent topic (valid datatype)', () => {
    const topic = "northcoders"
    return request(app)
      .get('/api/articles')
      .query({topic})
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Topic not found');
      });
  });
  test('GET:404 sends an appropriate status and error message when queried for a existing topic but with no corresponding articles', () => {
    const topic = "paper"
    return request(app)
      .get('/api/articles')
      .query({topic})
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Topic not found');
      });
  });
})

describe('/api/articles/:article_id/comments', () => {
  test('GET:200 Responds with an array of comments for an article_id which exists in the article table', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy('created_at', {descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        });
      });
  });
  test('GET:200 Responds with an empty array of comments for an article_id which exists in the article table but has no comments in the comments table', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0)
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Article not found');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/not-a-article/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
})

describe('/api/articles/:article_id/comments', () => {
  test('POST:201 inserts a new comment to the comments table and sends the new comment back to the client', () => {
    const newComment = {
      username: 'icellusedkars',
      body: 'quadruped auris'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        })
        expect(comment.article_id).toBe(3)
        expect(comment.author).toBe('icellusedkars')
        expect(comment.body).toBe('quadruped auris')
      });
  })
  test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no username)', () => {
    //err.code ---> 23502
    const newComment = {
      body: 'quadruped yaris'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('POST:400 responds with an appropriate status and error message when provided with a valid comment but non-existent (valid datatype) article_id', () => {
    //err.code ---> 23503
    const newComment = {
      username: 'icellusedkars',
      body: 'quadruped auris'
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Input parameter not found');
      });
  });
  test('POST:400 responds with an appropriate status and error message when provided with a valid comment but invalid datatype article_id', () => {
    //err.code ---> 22P02
    const newComment = {
      username: 'icellusedkars',
      body: 'quadruped auris'
    };
    return request(app)
      .post('/api/articles/not-a-id/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('POST:400 responds with an appropriate status and error message when provided with an invalid value (foreign key violation) for username property of comment object (article_id exists)', () => {
    //err.code ---> 23503
    const newComment = {
      username: 'nc_user',
      body: 'quadruped auris'
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Input parameter not found');
      });
  });
})

describe('/api/articles/:article_id', () => {
  test('PATCH:201 inserts a new comment to the comments table and sends the new comment back to the client', () => {
    const patchObj = {
      inc_votes : 100
    };
    return request(app)
      .patch('/api/articles/3')
      .send(patchObj)
      .expect(200)
      .then((response) => {
        expect(response.body.article.length).toBe(1);
        const article = response.body.article[0];
        expect(article).toMatchObject({
          title : expect.any(String),
          topic : expect.any(String),
          author : expect.any(String),
          body : expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        })
      });
  })
  test('PATCH:400 responds with an appropriate status and error message when provided with a empty patch object', () => {
    const patchObj = {
    };
    return request(app)
      .patch('/api/articles/3')
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  })
  test('PATCH:404 responds with an appropriate status and error message when provided with a non existent (valid datatype) article id', () => {
    const patchObj = {
      inc_votes : 100
    };
    return request(app)
      .patch('/api/articles/999')
      .send(patchObj)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Article not found');
      });
  })
  test('PATCH:404 responds with an appropriate status and error message when provided with a non existent (invalid datatype) article id', () => {
    const patchObj = {
      inc_votes : 100
    };
    return request(app)
      .patch('/api/articles/notvalidarticle')
      .send(patchObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  })
})


describe('/api/comments/:comment_id', () => {
  test('DELETE:204 deletes the specified comment and sends no content back', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204);
  });
  test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Comment does not exist');
      });
  });
  test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-team')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
})

describe('/api/users', () => {
  test('GET:200 sends an array of users to the client', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
          expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username : expect.any(String),
            name : expect.any(String),
            avatar_url : expect.any(String),
          })
        });
      });
  });
})