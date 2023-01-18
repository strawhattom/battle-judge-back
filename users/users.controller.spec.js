const app = require('../index')
const supertest = require('supertest')
const request = supertest(app)

describe('POST /register', () => {
  it('Should register the user', async () => {
    const user = {
      username: 'user',
      password: 'random_password',
      mail: 'user@dns.com'
    }

    const response = await request
      .post('/register')
      .send(user)
      .set('Accept', 'application/json')

    expect(response.headers['Content-Type']).toMatch(/json/)
    expect(response.status).toEqual(201)
    expect(response.body.role).toEqual('participant')
    expect(response.body.team).toEqual(1)
    expect(response.body.password).not.toEqual(user.password) // should hash the password
  })
})
