import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import React from 'react';
import usePreviewLinks from '../../hooks/use-preview-links';
import { LinkButton, Box, Divider, Flex } from '@strapi/design-system';
import { Link } from '@strapi/icons';
import { Eye } from '@strapi/icons';

import FutureIcon from './logo'

const PreviewButtons: React.FC = () => {
  const { modifiedData, layout, hasDraftAndPublish } = useCMEditViewDataManager();
  const isDraft = hasDraftAndPublish && !modifiedData.publishedAt
  const uid = layout?.uid
  const links = usePreviewLinks(uid, isDraft, modifiedData.id)

  if (!modifiedData.id) return null;

  return (
    <Box background="neutral0" hasRadius shadow="filterShadow" paddingTop={6} paddingBottom={4} paddingLeft={3} paddingRight={3}>
      <Flex alignItems="center"  justifyContent="center">
        <FutureIcon />
      </Flex>
      <Box paddingTop={3} paddingBottom={4}>
        <Divider />
      </Box>
      <Box paddingBottom={1}>
        <Flex direction="column" gap={2}>
          <LinkButton
            size="S"
            startIcon={<Link />}
            style={{width: '100%', textDecoration: 'none'}}
            href={links?.live ?? '/'}
            disabled={!links?.live}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            title="See content in Live"
          >
            Live Link
          </LinkButton>
          <LinkButton
            size="S"
            startIcon={<Eye/>}
            style={{width: '100%', textDecoration: 'none'}}
            href={links?.preview ?? '/'}
            disabled={!links?.preview}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            title="See content in Preview mode"
          >
            Preview
          </LinkButton>
        </Flex>
      </Box>
    </Box>
  )

}

export default PreviewButtons;