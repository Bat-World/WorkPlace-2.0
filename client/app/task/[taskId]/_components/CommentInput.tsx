'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Italic, Underline, Bold } from 'lucide-react';

export const CommentInput: React.FC = () => {
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormatting = (command: 'italic' | 'underline' | 'bold') => {
    document.execCommand(command, false, undefined);
    updateButtonStates();
  };

  const updateButtonStates = () => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('mouseup', updateButtonStates);
      editor.addEventListener('keyup', updateButtonStates);
      editor.addEventListener('touchend', updateButtonStates);
      updateButtonStates();
    }
    return () => {
      if (editor) {
        editor.removeEventListener('mouseup', updateButtonStates);
        editor.removeEventListener('keyup', updateButtonStates);
        editor.removeEventListener('touchend', updateButtonStates);
      }
    };
  }, []);

  const handleSend = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      // console.log('Sending comment (HTML):', content);
      editorRef.current.innerHTML = '';
      setIsItalic(false);
      setIsUnderline(false);
      setIsBold(false);
    }
  };

  return (
    <div className="my-5 bg-[#141318] p-5 rounded-[23px] border border-[#3D3C41] flex flex-col gap-5 h-fit">
      <div
        ref={editorRef}
        contentEditable={true}
        className={`
          w-full bg-transparent text-white focus:ring-0 focus:outline-none resize-none
          h-24 p-2 text-lg overflow-y-auto
        `}
        data-placeholder="Сэтгэгдэл үлдээх"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4 text-gray-400">
          <button
            onClick={() => applyFormatting('italic')}
            className={`p-1 rounded-md transition-colors ${isItalic ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Italic className="w-5 h-5" />
          </button>
          <button
            onClick={() => applyFormatting('underline')}
            className={`p-1 rounded-md transition-colors ${isUnderline ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Underline className="w-5 h-5" />
          </button>
          <button
            onClick={() => applyFormatting('bold')}
            className={`p-1 rounded-md transition-colors ${isBold ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Bold className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleSend}
          className="bg-[#3D3C41] text-white px-6 py-2 rounded-md font-medium hover:bg-[#4A494E] transition-colors"
        >
          Илгээх
        </button>
      </div>
    </div>
  );
};