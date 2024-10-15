import PreviewButtons from "./components/preview-buttons";
import { PLUGIN_ID } from "./constants";
import reducers from "./reducers/produce";

export default {
  register(app: any) {
    const plugin = {
      id: PLUGIN_ID,
      isReady: true,
      name: PLUGIN_ID,
    };

    app.registerPlugin(plugin);
    app.addReducers(reducers);
  },

  bootstrap(app: any) {
    app.getPlugin("content-manager").apis.addDocumentAction([PreviewButtons]);
  },
};
