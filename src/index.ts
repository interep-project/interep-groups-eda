import { Twitter } from './Twitter'

const main = async () => {
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
