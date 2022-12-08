import { Client } from 'twitter-api-sdk'

import { config } from './config'
import { Provider } from './Provider'
import { randomTwitterIds } from './utils'

interface User {
  public_metrics: any
  username: string
  verified: boolean
}

export class Twitter extends Provider<User> {
  client: Client

  constructor() {
    super('twitter.json')
    this.client = new Client(config.twitter.bearerToken)
  }

  randomIds() {
    return randomTwitterIds({ usedIds: this.ids })
  }

  processUsers(data?: { [key: string]: any }) {
    if (data !== undefined) {
      const [users, ids] = data.reduce(
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ([users, ids], { id, public_metrics, username, verified }) => {
          // no users for this id
          if (id === undefined) return [users, ids]

          users.push({ id, ...public_metrics, username, verified })
          ids.push(id)

          console.log(users)
          return [users, ids]
        },
        [[], []],
      )

      this.users.push(...users)
      this.ids.push(...ids)
    }
  }

  async fetchUsers(ids: string[]) {
    return this.client.users.findUsersById({
      ids,
      'user.fields': ['public_metrics', 'verified'],
    })
  }
}

export const twitter = new Twitter()
