import usePreviewLinks from "../../hooks/use-preview-links";
import { Link, Eye } from "@strapi/icons";
import type { DocumentActionComponent } from "@strapi/content-manager/strapi-admin";

const preview = {
  label: "Preview",
  icon: <Eye />,
  disabled: true,
};

const live = {
  label: "Live Link",
  icon: <Link />,
  disabled: true,
};

const PreviewButtons: DocumentActionComponent = ({
  activeTab,
  documentId,
  model,
  document,
}) => {
  const isDraft = activeTab === "draft";

  const links = usePreviewLinks(model, isDraft, documentId, document?.locale);

  if (!documentId || !model || !document) return preview;

  if (isDraft) {
    return {
      ...preview,
      onClick() {
        window.open(String(links?.preview), "_blank");
      },
      disabled: !links?.preview,
    };
  }

  return {
    ...live,
    onClick() {
      window.open(String(links?.live), "_blank");
    },
    disabled: !links?.live,
  };
};

export default PreviewButtons;
