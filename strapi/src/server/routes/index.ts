export default {
  'admin-api': {
    type: 'admin',
    routes: []
  },
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/contents',
        handler: 'contents.list',
      },
      {
        method: 'GET',
        path: '/contents/slugs',
        handler: 'contents.listSlugs',
      },
      {
        method: 'GET',
        path: '/contents/find-by-slug',
        handler: 'contents.findBySlug',
      }
    ],
  },
}