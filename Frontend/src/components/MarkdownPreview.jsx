import { renderMarkdown } from "../utils/renderMarkdown";

function MarkdownPreview({ content }) {
  return (
    <div
      className="markdown-content break-words text-gray-700"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}

export default MarkdownPreview;
