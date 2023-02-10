import { Reddit } from '../src/Reddit'

describe('Reddit', () => {
  const reddit = new Reddit()
  it('should fetch random subreddit', async () => {
    const subreddit = await reddit['get_random_subreddit']()

    expect(subreddit).toBeDefined()
    expect(subreddit.data.children[0].data.author).toBeDefined()
  })

  it('should fetch random authors', async () => {
    const authors = await reddit.randomAuthors()

    expect(authors).toBeDefined()
    expect(authors.length).toBeGreaterThan(0)
    expect(authors[0]).toBeDefined()
  })

  it('should fetch access_token', async () => {
    await reddit['auth']()
    expect(reddit['token']).toBeDefined()
  })

  it('should fetch one user', async () => {
    const user = await reddit['fetchUser']('r1oga')
    expect(user).toBeDefined()
    expect(user).toHaveProperty('name', 'r1oga')
    ;[
      'verified',
      'is_gold',
      'is_mod',
      'has_verified_email',
      'total_karma',
      'has_subscribed',
    ].forEach((key) => {
      expect(user).toHaveProperty(key)
    })
  })

  it.only('should fetch users', async () => {
    const users = await reddit.fetchUsers()

    expect(users).toBeDefined()
    expect(users.length).toBeGreaterThan(0)
    expect(users[0]).toBeDefined()
    ;[
      'verified',
      'is_gold',
      'is_mod',
      'has_verified_email',
      'total_karma',
      'has_subscribed',
    ].forEach((key) => {
      expect(users[0]).toHaveProperty(key)
    })
  })
})
