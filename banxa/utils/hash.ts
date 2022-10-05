export function stringToHash(string: string) {
  const secret = process.env.SECRET
  if (!secret) {
    throw new Error('No secret found')
  }
  const str = string + secret
  let hash = 0

  if (string.length == 0) return hash

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return Math.abs(hash)
}
