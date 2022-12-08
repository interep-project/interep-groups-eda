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

  abstract processUsers(data: { [key: string]: any }): void

  async loadUsers(size = SAMPLE_SIZE) {
    if (this.users.length >= size) {
      console.log(
        `${this.file} is already a data sample of size >= ${size} (${this.users.length})`,
      )
      return
    }

    while (this.users.length <= size) {
      let data

      try {
        data = (await this.fetchUsers(this.randomIds())).data
      } catch (e) {
        continue
      }

      this.processUsers(data)
    }
  }

  async writeUsers(size?: number) {
    await this.loadUsers(size)
    writeFileSync(this.file, JSON.stringify(this.users))
  }
}
