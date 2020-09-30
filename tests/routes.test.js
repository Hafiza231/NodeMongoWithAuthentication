/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';

describe('Get Endpoints', () => {
  it('should get all user', async () => {
    const res = await supertest(app)
      .get('/users');
    expect(res.statusCode).toEqual(401);
  });
});
