function isAmplifyBuild() {
  return (
    process.env.NODE_ENV !== 'development' &&
    (process.env.deployEnv === 'amplify' ||
      process.env.AMPLIFY_AMAZON_CLIENT_ID != null ||
      process.env.AMPLIFY_DIFF_DEPLOY != null)
  )
}

function getCacheHandler(projectCacheHandler) {
  if (projectCacheHandler != null) {
    return projectCacheHandler
  }

  if (projectCacheHandler === false || projectCacheHandler === '') {
    return undefined
  }

  if (isAmplifyBuild()) {
    return require.resolve('./amplify-cache-handler')
  }

  return undefined
}

module.exports = getCacheHandler
