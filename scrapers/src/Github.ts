import { faker } from '@faker-js/faker'
import { graphql } from '@octokit/graphql'
import { paginateGraphql } from '@octokit/plugin-paginate-graphql'
import { ok } from 'assert'
// import { writeFile } from 'fs/promises'

import { Octokit } from 'octokit'
import { GH_USER_MAX_ID } from './constants'
import { Provider } from './Provider'
import { getUserQuery } from './queries/get-gh-users.gql'

// TODO define GH type
export class Github extends Provider<any> {
  client: Octokit & {
    graphql: typeof graphql & {
      paginate: (
        query: string,
        initialParameters?: Record<string, any> | undefined,
      ) => Promise<any>
    }
  }

  constructor() {
    super('gh')
    ok(process.env.GH_PAT, 'GH_PAT is not defined')
    const PaginatedOctokit = Octokit.plugin(paginateGraphql)
    this.client = new PaginatedOctokit({ auth: process.env.GH_PAT })
  }

  randomIds(): string[] {
    const max = Math.floor((GH_USER_MAX_ID - 100) / 100)
    const startId = faker.datatype.number({ max, min: 1 })
    return this.usedIds.includes(startId.toString())
      ? this.randomIds()
      : [startId.toString()]
  }

  async fetchUserNodeIds(): Promise<string[]> {
    const [since] = this.randomIds()
    const users = await this.client.rest.users.list({
      per_page: 100,
      since: Number(since),
    })
    // console.log(since, users)
    return users.data.map((user) => user.node_id)
  }

  async fetchUsers(): Promise<
    Record<
      string,
      {
        followers: number
        issues: number
        login: string
        pullRequests: number
        sponsoring: number
        sponsors: number
        stars: number
        forks: number
        totalContributions: number
      }
    >
  > {
    const ids = await this.fetchUserNodeIds()
    let data: any[]

    try {
      // @ts-expect-error
      data = (await this.client.graphql(getUserQuery, { ids }))?.nodes
      // console.log(data)
    } catch (error) {
      // console.log(error);
      // @ts-expect-error
      data = error.data?.nodes
    }

    return data === undefined
      ? {}
      : data.reduce<
          Record<
            string,
            {
              followers: number
              issues: number
              login: string
              pullRequests: number
              sponsoring: number
              sponsors: number
              totalContributions: number
              forks: number
              stars: number
            }
          >
        >((users, user) => {
          if (user === null) return users
          const followers = user?.followers?.totalCount
          const issues = user?.issues?.totalCount
          const login = user?.login
          const pullRequests = user.pullRequests?.totalCount
          const sponsors = user?.sponsors?.totalCount
          const sponsoring = user?.sponsoring?.totalCount
          const totalContributions =
            user?.contributionsCollection?.contributionCalendar
              ?.totalContributions

          const { forks, stars } = (
            (user?.repositories?.nodes as Array<{
              stargazerCount: number
              forkCount: number
            }>) ?? []
          ).reduce(
            (acc, { forkCount, stargazerCount }) => ({
              forks: acc.forks + forkCount,
              stars: acc.stars + stargazerCount,
            }),
            {
              forks: 0,
              stars: 0,
            },
          )

          if (
            ![
              login,
              followers,
              totalContributions,
              issues,
              pullRequests,
              sponsors,
              sponsoring,
            ].includes(undefined)
          )
            users[login] = {
              followers,
              forks,
              issues,
              login,
              pullRequests,
              sponsoring,
              sponsors,
              stars,
              totalContributions,
            }

          return users
        }, {})
  }
}

export const github = new Github()
