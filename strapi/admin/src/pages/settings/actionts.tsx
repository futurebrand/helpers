import React, { useCallback, useState } from "react";

import {
  Box,
  Button,
  ContentLayout,
  Flex,
  Grid,
  GridItem,
  HeaderLayout,
  Main,
  Option,
  Select,
  TextInput,
  Typography,
} from "@strapi/design-system";
import { useFetchClient, useNotification } from "@strapi/helper-plugin";
import { ManyToMany } from "@strapi/icons";

const SettingsActions: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const fetchClient = useFetchClient();
  const toggleNotification = useNotification();

  const onUpdateSync = useCallback(async () => {
    setLoading(true);
    try {
      await fetchClient.post("/futurebrand-strapi-helpers/sync");
    } catch (error) {
      console.error(error);
      toggleNotification!({
        type: "warning",
        message: "An error occurred while updating the collections sync",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box
      background="neutral0"
      hasRadius
      shadow="filterShadow"
      paddingTop={6}
      paddingBottom={6}
      paddingLeft={7}
      paddingRight={7}
    >
      <Flex direction="column" alignItems="stretch" gap={4}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Typography variant="delta" as="h2">
            Actions
          </Typography>
        </Flex>
        <Grid gap={5}>
          <GridItem col={6} s={12}>
            <Button
              loading={isLoading}
              type="button"
              startIcon={<ManyToMany />}
              onClick={onUpdateSync}
            >
              Update Collections Sync
            </Button>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
};

export default SettingsActions;
