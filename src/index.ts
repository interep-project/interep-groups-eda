import { existsSync, mkdirSync } from 'fs'

import { DATA_DIR } from './constants'
import { Twitter } from './Twitter'

const maybeCreateDir = () => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR)
}
const main = async () => {
  maybeCreateDir()

  const sampleSize = Number(process.argv[2])
  const twitter = new Twitter()

  await twitter.loadUsers(sampleSize)
  await twitter.writeUsers()
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
