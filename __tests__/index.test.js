const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/');

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
          const expectedOutput = {
            "GET /api": {
              "description": "serves up a json representation of all the available endpoints of the api"
            },
            "GET /api/topics": {
              "description": "serves an array of all topics",
              "queries": [],
              "exampleResponse": {
                "topics": [{ "slug": "football", "description": "Footie!" }]
              }
            },
            "GET /api/articles": {
              "description": "serves an array of all articles",
              "queries": ["author", "topic", "sort_by", "order"],
              "exampleResponse": {
                "articles": [
                  {
                    "title": "Seafood substitutions are increasing",
                    "topic": "cooking",
                    "author": "weegembump",
                    "body": "Text from the article..",
                    "created_at": "2018-05-30T15:59:13.341Z",
                    "votes": 0,
                    "comment_count": 6
                  }
                ]
              }
            }
          }
          
          expect(data).toEqual(expectedOutput)
      });
  });
})
