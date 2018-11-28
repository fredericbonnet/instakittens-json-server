const supertest = require('supertest');

describe('Server', () => {
  it('should be listening', async () => {
    const request = supertest(global.url);
    await request.get('/').expect(200);
  });
});
