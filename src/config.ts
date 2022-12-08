import { readFileSync } from 'fs'
import { join } from 'path'

import YAML from 'yaml'
import { Config } from 'types/config'

export const config: Config = YAML.parse(
  readFileSync(join(__dirname, '..', '.config.yaml'), 'utf8'),
)
