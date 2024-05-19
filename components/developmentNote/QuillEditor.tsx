"use client";

import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/data/firebase";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleImageUpload = () => {
    if (typeof document !== 'undefined') { // Check if `document` is defined
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files ? input.files[0] : null;
        if (file) {
          const storageRef = ref(storage, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            snapshot => {
              // Progress handling (optional)
            },
            error => {
              console.error('Image upload failed:', error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                if (editorRef.current) {
                  const quill = (editorRef.current as any).__quill as Quill;
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, 'image', downloadURL);
                }
              });
            }
          );
        }
      };
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current && !(editorRef.current as any).__quill) { // Check if `window` is defined
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['bold', 'italic', 'underline'],
              ['image', 'code-block']
            ],
            handlers: {
              'image': handleImageUpload
            }
          }
        }
      });

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });

      // Set initial value
      quill.root.innerHTML = value;

      // Save Quill instance to the ref for later use
      (editorRef.current as any).__quill = quill;
    }
  }, [editorRef]);

  return <div ref={editorRef} />;
};

export default QuillEditor;