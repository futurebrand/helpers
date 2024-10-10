// @ts-nocheck
const path = require('path')
const FileSystemCache = require('next/dist/server/lib/incremental-cache/file-system-cache')

class AmplifyCacheHandler extends FileSystemCache.default {
  constructor(ctx) {
    super(ctx)
    this.serverDistDir = path.join(this.serverDistDir, 'pages', 'cache')
  }
}

module.exports = AmplifyCacheHandler
