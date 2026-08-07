import ReactMarkdown from "react-markdown";

function MarkdownPreview({ content }) {
  return (
    <div className="markdown-content break-words text-gray-700 prose prose-gray max-w-none">
      <ReactMarkdown>{content || ""}</ReactMarkdown>
    </div>
  );
}

export default MarkdownPreview;
