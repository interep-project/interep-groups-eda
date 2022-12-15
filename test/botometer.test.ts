import { botometer } from '../src/utils'

describe.skip('botometer', () => {
  it('fetches botometer scores for a list of usernames', async () => {
    const usernames = ['@r1oga', '@VitalikButerin']
    const scores = await botometer.getScores(usernames)

    expect(scores[0]).toMatchSnapshot()
    expect(scores[1]).toMatchSnapshot()
  })
})
