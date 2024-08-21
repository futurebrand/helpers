// @ts-nocheck

const path = require("path");
const FileSystemCache = require("next/dist/server/lib/incremental-cache/file-system-cache");

class CacheHandler extends FileSystemCache.default {
  constructor(ctx) {
    super(ctx);
  }

  isAmplifyBuild() {
    return (
      process.env.NODE_ENV !== "development" &&
      (process.env.deployEnv === "amplify" ||
        process.env.AMPLIFY_AMAZON_CLIENT_ID != null ||
        process.env.AMPLIFY_DIFF_DEPLOY != null)
    );
  }

  /**
   *
   * @param {string} pathname
   * @param {'app' | 'fetch' | 'pages'} kind
   * @returns
   */
  getFilePath(pathname, kind) {
    if (this.isAmplifyBuild()) {
      const pagesFolder = path.join(this.serverDistDir, "pages");
      switch (kind) {
        case "fetch":
          return path.join(pagesFolder, "cache", "fetch-cache", pathname);
        case "pages":
          return path.join(pagesFolder, "cache", "pages", pathname);
        case "app":
          return path.join(pagesFolder, "cache", "app", pathname);
        default:
          return super.getFilePath(pathname, kind);
      }
    }

    return super.getFilePath(pathname, kind);
  }
}

module.exports = CacheHandler;
