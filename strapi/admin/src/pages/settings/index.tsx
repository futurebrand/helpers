import React from "react";

import { SettingsPageTitle, CheckPagePermissions } from "@strapi/helper-plugin";
import { Main, Flex, HeaderLayout, ContentLayout } from "@strapi/design-system";

import SettingsActions from "./actionts";
import { PERMISSIONS } from "../../constants";

export const ProtectedSettingsPage = () => (
  <CheckPagePermissions permissions={PERMISSIONS.settings}>
    <SettingsPage />
  </CheckPagePermissions>
);

const SettingsPage = () => {
  return (
    <Main labelledBy="title" aria-busy={false}>
      <SettingsPageTitle name="Futurebrand" />
      <HeaderLayout id="title" title="Futurebrand Settings" subtitle="" />
      <ContentLayout>
        <Flex direction="column" alignItems="stretch" gap={8}>
          <SettingsActions />
        </Flex>
      </ContentLayout>
    </Main>
  );
};
