import { readFileSync } from 'fs'
import { join } from 'path'

import YAML from 'yaml'

export interface GhConfig {
  pat: string
  clientId: string
  clientSecret: string
}

export interface RdConfig {
  clientId: string
  clientSecret: string
}

export interface TwConfig {
  clientId: string
  clientSecret: string
  consumerKey: string
  consumerSecret: string
  bearerToken: string
  accessKey: string
  accessSecret: string
  rapidApiKey: string
}

export interface Config {
  github: GhConfig
  reddit: RdConfig
  twitter: TwConfig
}

export const config: Config = YAML.parse(
  readFileSync(join(__dirname, '..', '.config.yaml'), 'utf8'),
)
