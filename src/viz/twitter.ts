import 'data-forge-fs'
import {
  calculateReputation,
  OAuthProvider,
  ReputationLevel,
} from '@interep/reputation'
import * as df from 'data-forge'
import { plot } from 'nodeplotlib'

const data = df
  .readFileSync('data/twitter.csv')
  .parseCSV()
  .parseFloats(['display_scores.universal.overall'])
  .parseInts('user.user_data.followers_count')
  .select((row) => ({
    botometerOverallScore: row['display_scores.universal.overall'],
    followers: row['user.user_data.followers_count'],
    reputation: calculateReputation(OAuthProvider.TWITTER, {
      botometerOverallScore: row['display_scores.universal.overall'],
      followers: row['user.user_data.followers_count'],
      verifiedProfile: row['user.user_data.verified'] === 'true',
    }),
    verifiedProfile: Boolean(row['user.user_data.verified']),
  }))
  .orderBy((r) => r.reputation)

const reputation = data.getSeries('reputation')
const x = [
  ReputationLevel.UNRATED,
  ReputationLevel.BRONZE,
  ReputationLevel.SILVER,
  ReputationLevel.GOLD,
]
const y = x.map((level) => reputation.where((v) => v === level).count())

plot([{ type: 'bar', x, y }])
