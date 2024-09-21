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

    app.addReducers(reducers);
    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "futurebrand-helpers-preview-links",
        Component: PreviewButtons,
      });
  },
};
