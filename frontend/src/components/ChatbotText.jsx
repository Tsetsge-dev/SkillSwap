import React from 'react';

const renderInline = (text) => text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
  if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
  if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-slate-200/70 px-1 py-0.5 text-[0.92em]">{part.slice(1, -1)}</code>;
  return part;
});

const ChatbotText = ({ text }) => (
  <div className="space-y-1 whitespace-pre-wrap break-words">
    {String(text || '').split(/\r?\n/).map((line, index) => {
      const bullet = line.match(/^\s*[•*-]\s+(.+)$/);
      const numbered = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
      const heading = line.match(/^\s*#{1,3}\s+(.+)$/);
      if (!line.trim()) return <div key={index} aria-hidden="true" className="h-1" />;
      if (bullet) return <div key={index} className="flex gap-1.5"><span aria-hidden="true">•</span><span>{renderInline(bullet[1])}</span></div>;
      if (numbered) return <div key={index} className="flex gap-1.5"><span>{numbered[1]}.</span><span>{renderInline(numbered[2])}</span></div>;
      if (heading) return <div key={index} className="font-bold">{renderInline(heading[1])}</div>;
      return <div key={index}>{renderInline(line)}</div>;
    })}
  </div>
);

export default ChatbotText;
