import delay from 'delay'
import { readFileSync, writeFileSync } from 'fs'
import ms from 'ms'
import { join } from 'path'

import { DATA_DIR, SAMPLE_SIZE } from './constants'

export abstract class Provider<U> {
  path: string
  users: { [id: string]: U }

  get ids() {
    return Object.keys(this.users)
  }

  get size() {
    return this.ids.length
  }

  constructor(public name: string) {
    this.path = join(DATA_DIR, `${this.name}.json`)
    this.users = this.readLocalUsers()
  }

  readLocalUsers(): typeof this.users {
    try {
      return JSON.parse(readFileSync(this.path, 'utf8'))
    } catch (e) {
      return {}
    }
  }

  abstract randomIds(): string[]

  abstract fetchUsers(): Promise<any | []>

  async addUsers(size: number) {
    while (this.size < size) {
      let users

      try {
        users = await this.fetchUsers()
        console.log(users)
        this.users = { ...this.users, ...users }
      } catch (e) {
        console.error(e)
        continue
      } finally {
        // throttle to avoid rate limit
        await delay(ms('1s'))
      }
    }
  }

  async maybeWriteUsers(size = SAMPLE_SIZE) {
    if (this.size >= size) {
      console.log(`Local sample is already of size >= ${size} (${this.size})`)
      return
    }

    await this.addUsers(size)
    writeFileSync(this.path, JSON.stringify(this.users))
  }
}
