import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { DATA_DIR, SAMPLE_SIZE } from './constants'

export abstract class Provider<U> {
  ids: string[]
  file: string
  users: Array<U & { id: string }>

  constructor(filename: string) {
    this.file = join(DATA_DIR, filename)
    const _users = this.getLocalUsers()
    this.users = _users
    this.ids = _users.map((user) => user.id)
  }

  getLocalUsers(): typeof this.users {
    try {
      return JSON.parse(readFileSync(this.file, 'utf8'))
    } catch (e) {
      return []
    }
  }

  abstract randomIds(): string[]

  abstract fetchUsers(ids: string[]): Promise<any>

  async loadUsers(size = SAMPLE_SIZE) {
    while (this.users.length <= size) {
      let data

      try {
        data = (await this.fetchUsers(this.randomIds())).data
      } catch (e) {
        continue
      }

      if (data !== undefined) {
        const [users, ids] = data.reduce(
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ([users, ids], { id, public_metrics, username, verified }) => {
            // no users for this id
            if (id === undefined) return [users, ids]

            users.push({ id, ...public_metrics, username, verified })
            ids.push(id)

            console.log(users)
            return [users, ids]
          },
          [[], []],
        )

        this.users.push(...users)
        this.ids.push(...ids)
      }
    }
  }

  writeUsers() {
    writeFileSync(this.file, JSON.stringify(this.users))
  }
}
