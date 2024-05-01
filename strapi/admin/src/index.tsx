
import PreviewButtons from './components/preview-buttons';
import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import reducers from './reducers/produce'

const name = pluginPkg.strapi.name

export default {
  register(app: any) {
    const plugin = {
      id: pluginId,
      isReady: true,
      name,
    }
    
    app.addReducers(reducers);
    app.registerPlugin(plugin)
  },

  bootstrap(app: any) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'futurebrand-helpers-preview-links',
      Component: PreviewButtons
    });
  }
}
