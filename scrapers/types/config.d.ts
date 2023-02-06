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
  accessToken: string
  accessTokenSecret: string
  bearerToken: string
  clientId: string
  clientSecret: string
  consumerKey: string
  consumerSecret: string
  rapidApiKey: string
}

export interface Config {
  github: GhConfig
  reddit: RdConfig
  twitter: TwConfig
}
