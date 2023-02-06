export const getUserQuery = `query($ids:[ID!]!) {
    nodes(ids:$ids) {
        ... on User {
            login
            databaseId
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

        }
    }
}
`
