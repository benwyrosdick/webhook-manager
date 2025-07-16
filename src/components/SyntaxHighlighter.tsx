import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeHighlighter({ code, language = 'json', className = '' }: SyntaxHighlighterProps) {
  const formatCode = (str: string) => {
    if (!str || str.trim() === '') return 'Empty';
    
    try {
      // Try to parse and format as JSON
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If not valid JSON, return as-is
      return str;
    }
  };

  const formattedCode = formatCode(code);
  
  if (formattedCode === 'Empty') {
    return (
      <div className={`bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 text-gray-500 ${className}`}>
        Empty
      </div>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={oneLight}
      className={`!bg-gray-50 !border !border-gray-200 !rounded-lg !text-sm ${className}`}
      customStyle={{
        margin: 0,
        padding: '12px',
        fontSize: '13px',
        lineHeight: '1.4',
      }}
    >
      {formattedCode}
    </SyntaxHighlighter>
  );
}