import 'data-forge-fs'
import * as df from 'data-forge'
import { plot } from 'nodeplotlib'

const data = df
  .readFileSync('data/reddit.csv')
  .parseCSV()
  .parseInts(['comment_karma', 'link_karma'])
  // .where((row) => row.comment_karma < 10_000 && row.link_karma < 40_000)
  .select((row) => ({
    commentKarma: row.comment_karma,
    linkKarma: row.link_karma,
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    // sumKarma: row.comment_karma + row.link_karma,
  }))

const BUCKETS = 10

const commentKarmaSeries = data
  .getSeries('commentKarma')
  .where((karma) => karma < 20_000 && karma > 0)
  .bucket(BUCKETS)

const commentKarma = {
  name: 'Comment Karma',
  x: commentKarmaSeries.getSeries('Mid').distinct().toArray(),
  y: [...Array(BUCKETS).keys()].map((bucket) =>
    commentKarmaSeries.where((row) => row.Bucket === bucket).count(),
  ),
}

const linkKarmaSeries = data
  .getSeries('linkKarma')
  .where((karma) => karma < 10_000 && karma > 5_000)
  .bucket(BUCKETS)

console.log(
  data
    .getSeries('commentKarma')
    .where((karma) => karma < 10_000 && karma > 5_000)
    .toArray().length,
  data
    .getSeries('linkKarma')
    .where((karma) => karma < 10_000 && karma > 5_000)
    .toArray().length,
)
const linkKarma = {
  name: 'Link Karma',
  x: linkKarmaSeries.getSeries('Mid').distinct().toArray(),
  y: [...Array(BUCKETS).keys()].map((bucket) =>
    linkKarmaSeries.where((row) => row.Bucket === bucket).count(),
  ),
}

;[commentKarma, linkKarma].forEach(({ name, x, y }) => {
  plot([{ name, type: 'bar', x, y }])
})
