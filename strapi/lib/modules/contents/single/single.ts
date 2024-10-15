import { populateCollection } from "@futurebrand/utils";

import ContentSingleFeatures from "./features";

class ContentSingle extends ContentSingleFeatures {
  public async register() {
    await super.register();

    const generatedPopulate = populateCollection(this.uid);

    this.populate = {
      ...(generatedPopulate || {}),
      ...this.populate,
    };
  }
}

export default ContentSingle;
