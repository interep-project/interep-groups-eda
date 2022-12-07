import { join } from 'path'

import { Client } from 'twitter-api-sdk'

import { config } from './config'
import { Provider } from './Provider'
import { randomTwitterIds } from './utils'

export class Twitter extends Provider<{
  public_metrics: any
  username: string
  verified: boolean
}> {
  client: Client

  constructor() {
    super(join(__dirname, '..', 'twitter.json'))
    this.client = new Client(config.twitter.bearerToken)
  }

  randomIds() {
    return randomTwitterIds({ usedIds: this.ids })
  }

  async fetchUsers(ids: string[]) {
    return this.client.users.findUsersById({
      ids,
      'user.fields': ['public_metrics', 'verified'],
    })
  }
}

export const twitter = new Twitter()
