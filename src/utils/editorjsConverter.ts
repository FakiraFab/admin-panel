import edjsHTML from "editorjs-html";
import { OutputData } from "@editorjs/editorjs";

// Initialize the editorjs-html parser
const edjsParser = edjsHTML();

/**
 * Convert Editor.js JSON output to HTML string
 */
export function editorJsToHtml(data: OutputData): string {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return "";
  }
  
  try {
    const html = edjsParser.parse(data);
    // Check if html is an array before calling join
    if (Array.isArray(html)) {
      return html.join("");
    }
    // If not an array, return it as string
    return String(html);
  } catch (error) {
    console.error("Error converting Editor.js to HTML:", error);
    return "";
  }
}

/**
 * Convert HTML string to Editor.js JSON format
 * This is a simple implementation that handles common HTML tags
 */
export function htmlToEditorJs(html: string): OutputData {
  if (!html || html.trim() === "") {
    return {
      time: Date.now(),
      blocks: [],
      version: "2.28.0",
    };
  }

  interface EditorBlock {
    type: string;
    data: {
      text?: string;
      level?: number;
      style?: string;
      items?: string[];
      caption?: string;
      url?: string;
      withBorder?: boolean;
      stretched?: boolean;
      withBackground?: boolean;
    };
  }

  const blocks: EditorBlock[] = [];
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html.trim();

  // Process each child node
  Array.from(tempDiv.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          blocks.push({
            type: "header",
            data: {
              text: element.textContent || "",
              level: parseInt(tagName.charAt(1)),
            },
          });
          break;

        case "p":
          const text = element.textContent || "";
          if (text.trim()) {
            // Use innerHTML to preserve basic formatting like <strong>, <em>
            // Note: This is safe because it's parsing existing HTML from the database
            blocks.push({
              type: "paragraph",
              data: {
                text: element.innerHTML || "",
              },
            });
          }
          break;

        case "ul":
          const ulItems: string[] = [];
          element.querySelectorAll("li").forEach((li) => {
            ulItems.push(li.textContent || "");
          });
          if (ulItems.length > 0) {
            blocks.push({
              type: "list",
              data: {
                style: "unordered",
                items: ulItems,
              },
            });
          }
          break;

        case "ol":
          const olItems: string[] = [];
          element.querySelectorAll("li").forEach((li) => {
            olItems.push(li.textContent || "");
          });
          if (olItems.length > 0) {
            blocks.push({
              type: "list",
              data: {
                style: "ordered",
                items: olItems,
              },
            });
          }
          break;

        case "blockquote":
          blocks.push({
            type: "quote",
            data: {
              text: element.textContent || "",
              caption: "",
            },
          });
          break;

        case "img":
          blocks.push({
            type: "image",
            data: {
              url: element.getAttribute("src") || "",
              caption: element.getAttribute("alt") || "",
              withBorder: false,
              stretched: false,
              withBackground: false,
            },
          });
          break;

        default:
          // For any other tag, treat as paragraph
          const defaultText = element.textContent || "";
          if (defaultText.trim()) {
            // Use innerHTML to preserve basic formatting like <strong>, <em>
            // Note: This is safe because it's parsing existing HTML from the database
            blocks.push({
              type: "paragraph",
              data: {
                text: element.innerHTML || "",
              },
            });
          }
          break;
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || "";
      if (text) {
        blocks.push({
          type: "paragraph",
          data: {
            text: text,
          },
        });
      }
    }
  });

  return {
    time: Date.now(),
    blocks: blocks,
    version: "2.28.0",
  };
}
