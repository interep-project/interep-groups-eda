import { config } from './config'
import { Provider } from './Provider'
import FormUrlAddon from 'wretch/addons/formUrl'

import { http } from './http'

export class Reddit extends Provider<any> {
  private token: string | undefined

  constructor() {
    super('reddit')
  }

  async fetchUsers(): Promise<any> {
    return Promise.resolve(undefined)
  }

  // async randomAuthors(): Promise<any> {
  //     try {
  //
  //     const res = await fetch('https://www.reddit.com/r/random.json')
  //     const json = await res.json()
  //     console.log(res)
  //     // @ts-expect-error
  //     return json.data.children.slice(0, 10).map((child: { data: { author: string } }) => child.data.author)
  //     } catch (err) {
  //         console.log(err)
  //         return []
  //     }
  // }

  private async get_request(
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

  private async auth(): Promise<void> {
    const authorization = Buffer.from(
      `${config.reddit.clientId}:${config.reddit.clientSecret}`,
    ).toString('base64')
    console.log({ authorization })
    try {
      const response = await http('https://www.reddit.com/api/v1/access_token')
        .addon(FormUrlAddon)
        .formUrl(
          new URLSearchParams({
            device_id: 'DO_NOT_TRACK_THIS_DEVICE',
            grant_type: 'https://oauth.reddit.com/grants/installed_client',
          }),
        )
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

  async get_random_subreddit(): Promise<string> {
    return await this.get_request('r/random.json')
  }
}
