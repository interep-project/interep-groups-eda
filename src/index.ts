import { Twitter } from './Twitter'

const main = async () => {
  const twitter = new Twitter()

  await twitter.loadUsers()
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
