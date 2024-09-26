import { ContentsService, GlobalService } from "@futurebrand/services";

export default {
  contents: new ContentsService(),
  global: new GlobalService(),
};
