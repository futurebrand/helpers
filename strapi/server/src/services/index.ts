import {
  ContentsService,
  GlobalService,
  SyncService,
} from "@futurebrand/services";

export default {
  contents: new ContentsService(),
  global: new GlobalService(),
  sync: new SyncService(),
};
