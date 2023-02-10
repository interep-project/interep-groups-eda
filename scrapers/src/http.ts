import wretch from 'wretch'

// using polyfill of fetch
// as native node (>= 18) fetch has errors with reddit pages (udici deps error)
export const http = (url: string) =>
  wretch(url)
    .polyfills({
      fetch: require('node-fetch'),
      FormData: require('form-data'),
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      URLSearchParams: require('url').URLSearchParams,
    })
    .resolve(async (r) => r.json())
