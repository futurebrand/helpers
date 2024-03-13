export const getCMSMediaUrl = (path: string) => {
  if (path && path.startsWith('/')) {
    return `${process.env.cmsBaseUrl}${path}`
  }
  return path
}
