import { reddit } from '../src/Reddit'

describe('Reddit', () => {
  it('Get 1 user', async () => {
    const user = await reddit.getUser()
    console.log({ user })
    expect(user).toBeDefined()
  })
})
