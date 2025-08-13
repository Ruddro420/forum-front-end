import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
  keyboard: {
    bindings: {
      bold: {
        key: 'B',
        shortKey: true,
        handler: function(range, context) {
          this.quill.format('bold', !context.format.bold);
        }
      },
      italic: {
        key: 'I',
        shortKey: true,
        handler: function(range, context) {
          this.quill.format('italic', !context.format.italic);
        }
      },
      underline: {
        key: 'U',
        shortKey: true,
        handler: function(range, context) {
          this.quill.format('underline', !context.format.underline);
        }
      },
      strike: {
        key: 'S',
        shortKey: true,
        shiftKey: true,
        handler: function(range, context) {
          this.quill.format('strike', !context.format.strike);
        }
      },
      blockquote: {
        key: '9', // 9 = '(' key
        shortKey: true,
        shiftKey: true,
        handler: function(range, context) {
          this.quill.format('blockquote', !context.format.blockquote);
        }
      },
      orderedList: {
        key: '7', // '7' key
        shortKey: true,
        shiftKey: true,
        handler: function(range, context) {
          const isActive = context.format['list'] === 'ordered';
          this.quill.format('list', isActive ? false : 'ordered');
        }
      },
      bulletList: {
        key: '8', // '8' key
        shortKey: true,
        shiftKey: true,
        handler: function(range, context) {
          const isActive = context.format['list'] === 'bullet';
          this.quill.format('list', isActive ? false : 'bullet');
        }
      },
    }
  }
};

const formats = [
  "header",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet",
  "link", "image",
];

const RichTextEditor = ({ value, onChange, className }) => (
  <ReactQuill
  style={{ minHeight: '200px' }}
  className={className}
    theme="snow"
    value={value}
    onChange={onChange}
    modules={modules}
    formats={formats}
  />
);

export default RichTextEditor;
