import {Reddit} from "../src/Reddit";

describe('Reddit', () => {
    it('should fetch random authors', async () => {
        const reddit = new Reddit()
        const subreddit = await reddit.randomAuthors()

        console.log(subreddit)
        expect(subreddit).toBeDefined()
    })
})