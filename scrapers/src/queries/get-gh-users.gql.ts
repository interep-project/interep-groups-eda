export const getUserQuery = `query($ids:[ID!]!) {
    nodes(ids:$ids) {
        ... on User {
            login
            followers {
                totalCount
            }
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                }
            }
            issues {
                totalCount
            }
            pullRequests {
                totalCount
            }
            sponsors {
                totalCount
            }
            sponsoring {
                totalCount
            }
            repositories(first: 10) {
                nodes {
                    stargazerCount
                    forkCount
                }
            }
        }
    }
}
`
