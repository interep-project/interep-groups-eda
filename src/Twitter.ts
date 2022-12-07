import { Client } from 'twitter-api-sdk'

import { config } from './config'

class Twitter {
  client: Client

  constructor() {
    this.client = new Client(config.twitter.bearerToken)
  }

  async getMetrics(ids: string[]) {
    return this.client.users.findUsersById({
      ids,
      'user.fields': ['public_metrics', 'verified'],
    })
  }
}

export const twitter = new Twitter()
