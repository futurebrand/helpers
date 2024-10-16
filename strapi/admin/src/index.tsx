import PreviewButtons from "./components/preview-buttons";
import reducers from "./reducers/produce";
import { PLUGIN_ID, PERMISSIONS } from "./constants";

export default {
  register(app: any) {
    const plugin = {
      id: PLUGIN_ID,
      isReady: true,
      name: PLUGIN_ID,
    };

    app.createSettingSection(
      {
        id: "futurebrand",
        intlLabel: {
          id: "futurebrand.settings.section-label",
          defaultMessage: "Futurebrand",
        },
      },
      [
        {
          intlLabel: {
            id: "futurebrand.settings.title",
            defaultMessage: "Settings",
          },
          id: "settings",
          to: "/settings/futurebrand",
          async Component() {
            const { ProtectedSettingsPage } = await import("./pages/settings");
            return ProtectedSettingsPage;
          },
          permissions: PERMISSIONS.settings,
        },
      ]
    );

    app.addReducers(reducers);
    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "futurebrand-helpers-preview-links",
      Component: PreviewButtons,
    });
  },
};
