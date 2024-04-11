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
        handler: 'contents.query',
      },
      {
        method: 'GET',
        path: '/contents/map',
        handler: 'contents.map',
      },
      {
        method: 'GET',
        path: '/contents/single',
        handler: 'contents.single',
      }
    ],
  },
}