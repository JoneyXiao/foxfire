import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownBodyProps = {
  source: string;
};

export function MarkdownBody({ source }: MarkdownBodyProps) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href }) => (
            <a href={href} rel="noreferrer">
              {children}
            </a>
          ),
          h1: ({ children }) => <h2>{children}</h2>,
          h2: ({ children }) => <h3>{children}</h3>,
          code: ({ className, children, ...props }) => {
            const isBlock = Children.toArray(children).some(
              (child) => isValidElement(child) || String(child).includes("\n"),
            );
            if (isBlock || className) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <code {...props}>{children}</code>;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
