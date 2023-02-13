import FormUrlAddon from 'wretch/addons/formUrl'
import { config } from './config'
import { http } from './http'

import { Provider } from './Provider'

export class Reddit extends Provider<any> {
  private token: string | undefined

  constructor() {
    super('reddit')
  }

  private async auth(): Promise<void> {
    try {
      const response = await http('https://www.reddit.com/api/v1/access_token')
        .addon(FormUrlAddon)
        .formUrl({
          device_id: 'DO_NOT_TRACK_THIS_DEVICE',
          grant_type: 'https://oauth.reddit.com/grants/installed_client',
        })
        .auth(
          `Basic ${Buffer.from(
            `${config.reddit.clientId}:${config.reddit.clientSecret}`,
          ).toString('base64')}`,
        )
        .post()

      // @ts-expect-error
      if (response.error === undefined) {
        // @ts-expect-error
        this.token = response.access_token
      }
    } catch (err) {
      console.log(err)
    }
  }

  private async authed_get_request(
    path: string,
    query?: Record<string, any>,
  ): Promise<any> {
    if (this.token === undefined) {
      await this.auth()
    }

    return (
      http(
        `https://oauth.reddit.com/${path}?${new URLSearchParams(
          query,
        ).toString()}`,
      )
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        .auth(`Bearer ${this.token}`)
        .get()
    )
  }

  async randomAuthors(): Promise<any> {
    try {
      const json = await this.get_random_subreddit()
      return (json?.data?.children ?? []).map(
        (child: { data: { author: string } }) => child.data.author,
      )
    } catch (err) {
      console.log(err)
      return []
    }
  }

  private async fetchUser(username: string): Promise<any> {
    const user = await this.authed_get_request(`user/${username}/about`)
    return { [user.data.name]: user.data }
  }

  async fetchUsers(): Promise<any[]> {
    const authors = await this.randomAuthors()
    const users = await Promise.all(authors.map(this.fetchUser.bind(this)))
    return users.reduce((acc, user) => ({ ...acc, ...user }), {})
  }

  private async get_random_subreddit(): Promise<any> {
    return http('https://www.reddit.com/r/random.json').get()
  }
}

export const reddit = new Reddit()
