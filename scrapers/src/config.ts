import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import YAML from 'yaml'
import { Config } from 'types/config'

const path = join(__dirname, '..')
const exists = existsSync(join(path, '.config.yaml'))
const file = exists
  ? join(path, '.config.yaml')
  : join(path, '.config.test.yaml')

export const config: Config = YAML.parse(readFileSync(file, 'utf8'))
