// import { AuthorizationCode, Token } from 'simple-oauth2'
import Client from 'reddit'

import { config } from './config'

class Reddit {
  client: any

  constructor() {
    this.client = new Client({
      appId: config.reddit.clientId,
      appSecret: config.reddit.clientSecret,
      password: config.reddit.password,
      userAgent: 'MyApp/1.0.0 (http://example.com)',
      username: config.reddit.username,
    })
  }

  async getUser() {
    return await this.client.get(`/user/Valve92_jasonbroken/about`)
  }
}

export const reddit = new Reddit()
