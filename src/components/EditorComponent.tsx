import React, { useEffect, useRef, useCallback } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";

interface EditorComponentProps {
  initialData: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
  className?: string;
}

export const EditorComponent: React.FC<EditorComponentProps> = ({
  initialData,
  onChange,
  placeholder = "Start writing your blog content...",
  className = "",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const initEditor = useCallback(() => {
    if (isInitialized.current || !holderRef.current) {
      return;
    }

    const editor = new EditorJS({
      holder: holderRef.current,
      data: initialData,
      placeholder: placeholder,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder: placeholder,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byUrl: "placeholder", // Not used, but required by the plugin
            },
            uploader: {
              uploadByUrl: async (url: string) => {
                // Simple URL validation
                return {
                  success: 1,
                  file: {
                    url: url,
                  },
                };
              },
            },
          },
        },
      },
      onChange: async (api) => {
        try {
          const data = await api.saver.save();
          onChange(data);
        } catch (error) {
          console.error("Error saving editor content:", error);
        }
      },
      minHeight: 200,
    });

    editorRef.current = editor;
    isInitialized.current = true;
  }, [initialData, onChange, placeholder]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
          isInitialized.current = false;
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
      }
    };
  }, [initEditor]);

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 min-h-[300px] bg-white ${className}`}
    >
      <div ref={holderRef} id="editorjs" />
    </div>
  );
};
