import { existsSync, mkdirSync } from 'fs'

import { DATA_DIR } from './constants'
import { twitter } from './Twitter'

const maybeCreateDir = () => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR)
}

const main = async () => {
  maybeCreateDir()
  const sampleSize = Number(process.argv[2])
  await twitter.writeUsers(sampleSize)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
