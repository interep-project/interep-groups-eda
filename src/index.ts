import { readFileSync, writeFileSync } from 'fs'

import { twitter } from './Twitter'
import { randomTwitterIds } from './utils'

interface User {
  id: string

  [key: string]: any
}

type Users = User[]

const users: Users = []
const usedIds: string[] = []

function loadUsers() {
  const twUsers: Users = JSON.parse(readFileSync('twitter.json', 'utf8'))
  users.push(...twUsers)
  usedIds.push(...twUsers.map((twUser) => twUser.id))
}

const main = async () => {
  loadUsers()

  while (users.length < 500) {
    const ids = randomTwitterIds({ usedIds })
    let data

    try {
      data = (await twitter.getMetrics(ids)).data
    } catch (e) {
      continue
    }

    console.log(data)
    if (data !== undefined) {
      const [twUsers, twUserIds] = data.reduce<[Users, string[]]>(
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ([twUsers, twUserIds], { id, public_metrics, username, verified }) => {
          // no users for this id
          if (id === undefined) return [twUsers, twUserIds]

          twUsers.push({ id, ...public_metrics, username, verified })
          twUserIds.push(id)

          return [twUsers, twUserIds]
        },
        [[], []],
      )

      users.push(...twUsers)
      usedIds.push(...twUserIds)
    }
  }

  writeFileSync('twitter.json', JSON.stringify(users))
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
