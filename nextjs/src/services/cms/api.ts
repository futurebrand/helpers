import { Fetcher } from "@futurebrand/modules/fetcher";

let api: Fetcher;

const cmsType = process.env.cmsType || "strapi";

if (cmsType === "strapi") {
  const basePath = `${process.env.cmsUrl}/api`;

  const adminEnvKey = process.env.adminEnvKey || "CMS_BACKEND_TOKEN";
  const adminToken = adminEnvKey ? process.env[adminEnvKey] : null;
  const token = adminToken || process.env.cmsPublicToken;

  api = new Fetcher(basePath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
} else if (cmsType === "wp" || cmsType === "wordpress") {
  const basePath = `${process.env.cmsUrl}/wp-json`;
  api = new Fetcher(basePath);
}

export default api;
