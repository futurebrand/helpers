declare const usePreviewLinks: (api?: string, isDraft?: boolean, id?: any) => {
    live: string | null;
    preview: string | null;
} | null;
export default usePreviewLinks;
