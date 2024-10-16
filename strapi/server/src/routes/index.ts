export default {
  "admin-api": {
    type: "admin",
    routes: [
      {
        method: "GET",
        path: "/preview",
        handler: "preview.links",
        config: {
          policies: ["admin::isAuthenticatedAdmin"],
        },
      },
      {
        method: "POST",
        path: "/sync",
        handler: "sync.run",
        config: {
          policies: [
            "admin::isAuthenticatedAdmin",
            {
              name: "admin::hasPermissions",
              config: {
                actions: ["plugin::futurebrand-strapi-helpers.settings.read"],
              },
            },
          ],
        },
      },
    ],
  },
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/global",
        handler: "global.data",
      },
      {
        method: "GET",
        path: "/global/seo",
        handler: "global.seo",
      },
      {
        method: "GET",
        path: "/global/locales",
        handler: "global.locales",
      },
      {
        method: "GET",
        path: "/contents",
        handler: "contents.query",
      },
      {
        method: "GET",
        path: "/contents/map",
        handler: "contents.map",
      },
      {
        method: "GET",
        path: "/contents/single",
        handler: "contents.single",
      },
      {
        method: "GET",
        path: "/contents/seo",
        handler: "contents.seo",
      },
      {
        method: "GET",
        path: "/contents/preview",
        handler: "contents.preview",
      },
    ],
  },
};
