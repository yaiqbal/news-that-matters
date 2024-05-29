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
          const article = response.body.article
          expect(article.length).toBe(1);
          expect(typeof article[0].article_id).toBe('number');
          expect(typeof article[0].title).toBe('string');
          expect(typeof article[0].topic).toBe('string');
          expect(typeof article[0].author).toBe('string');
          expect(typeof article[0].body).toBe('string');
          expect(typeof article[0].created_at).toBe('string');
          expect(typeof article[0].votes).toBe('number');
          expect(typeof article[0].article_img_url).toBe('string'); 
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
  test('GET:200 Responds with an articles array of article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
          expect(response.body.articles.length).toBe(13);
          expect(response.body.articles).toBeSortedBy('created_at', {descending: true });
        response.body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.title).toBe('string');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.author).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string'); 
          expect(typeof parseInt(article.comment_count)).toBe('number');
          expect(article).not.toHaveProperty('body'); 
        });
      });
  });
})