interface URL {
  scheme?: string
  username?: string
  password?: string
  hostname: string
  port?: number
  endpoint?: string
}

/**
 * Builds a URL string from a URL object
 * @param url an object of URL parameters
 * @returns a URL string
 */
export function URLBuilder (url: URL): string {
  // Remove beginning forward slash from endpoint if there is one
  if (url.endpoint !== undefined && url.endpoint.length > 0) {
    url.endpoint = url.endpoint[0] === '/' ? url.endpoint.slice(1) : url.endpoint
  }

  let build = ''

  // Build URL string
  if (url.scheme !== undefined) build += url.scheme + '://'
  if (url.username !== undefined && url.password !== undefined) build += url.username + ':' + url.password + '@'
  build += url.hostname
  if (url.port !== undefined) build += ':' + url.port.toString()
  if (url.endpoint !== undefined) build += url.endpoint

  return build
}
