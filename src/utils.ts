import { faker } from '@faker-js/faker'
import { Botometer as _Botometer } from 'botometer'

import { config } from './config'

export const randomTwitterIds = ({
  size = 100,
  usedIds = [],
}: {
  size?: number
  usedIds?: string[]
} = {}) => {
  const ids: string[] = []

  while (ids.length < size) {
    const id = faker.random.numeric(faker.datatype.number({ max: 19, min: 1 }))

    if (!usedIds.includes(id) && !ids.includes(id) && id !== '') {
      ids.push(id)
    }
  }

  return ids
}

class Botometer extends _Botometer {
  constructor() {
    const { bearerToken, ...rest } = config.twitter
    super({ ...rest, usePro: true })
  }

  async getScores(usernames: string[]) {
    console.log(usernames)
    const scores = await super.getScores(usernames)
    console.log(scores)
    return scores.reduce(
      (
        scores: { [x: string]: any },
        score: { [x: string]: any; error?: any; user?: any; twitterData?: any },
      ) => {
        if (score?.user?.user_data === undefined) return scores

        const { twitterData, ...scoreData } = score
        scores[score.user.user_data.id_str] = scoreData
        console.log(score.user.user_data.screen_name, score.user.user_data.id)

        return scores
      },
      {},
    )
  }
}

export const botometer = new Botometer()
