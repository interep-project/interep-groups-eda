import { Botometer } from 'botometer'
import { Client } from 'twitter-api-sdk'

import { config } from './config'
import { Provider } from './Provider'
import { botometer, randomTwitterIds } from './utils'

interface User {
  id: string
  botometer?: any
  public_metrics: any
  username: string
  verified: boolean
}

export class Twitter extends Provider<User> {
  botometer: typeof Botometer
  client: Client

  constructor() {
    super('twitter')
    this.client = new Client(config.twitter.bearerToken)
    this.botometer = botometer
  }

  randomIds() {
    const ids = randomTwitterIds({ usedIds: this.usedIds })
    this.usedIds.push(...ids)
    return ids
  }

  async fetchUsernames(ids: string[]) {
    const { data } = await this.client.users.findUsersById({ ids })
    return (
      data?.reduce<string[]>((usernames, { username }) => {
        if (username !== undefined) usernames.push(username)
        return usernames
      }, []) ?? []
    )
  }

  async fetchUsers() {
    const usernames = await this.fetchUsernames(this.randomIds())
    return this.botometer.getScores(usernames)
  }
}

export const twitter = new Twitter()
