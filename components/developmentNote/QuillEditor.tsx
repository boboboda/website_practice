"use client"

import React, { useRef, useCallback, useMemo } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/data/firebase';
import QuillNoSSRWrapper from './QuillNoSSRWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillInstance = useRef<ReactQuill>(null);

  // const handleImageUpload = useCallback(() => {
  //   if (typeof document !== 'undefined') {
  //     const input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', 'image/*');
  //     input.click();

  //     input.onchange = async () => {
  //       const file = input.files ? input.files[0] : null;
  //       if (file) {
  //         const storageRef = ref(storage, `images/${file.name}`);
  //         const uploadTask = uploadBytesResumable(storageRef, file);

  //         uploadTask.on(
  //           'state_changed',
  //           snapshot => {
  //             // Progress handling (optional)
  //           },
  //           error => {
  //             console.error('Image upload failed:', error);
  //           },
  //           () => {
  //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //               if (quillInstance.current) {
  //                 const quill = quillInstance.current.getEditor();
  //                 const range = quill.getSelection(true);
  //                 quill.insertEmbed(range.index, 'image', downloadURL);
  //               }
  //             });
  //           }
  //         );
  //       }
  //     };
  //   }
  // }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      // handlers: {
      //   'image': handleImageUpload
      // }
    },
    imageCompress: {
      quality: 0.7,
      maxWidth: 222, 
      maxHeight: 222, 
      debug: true,
      suppressErrorLogging: false, 
      insertIntoEditor: undefined,
    },
  }), []);

  return (
    <div>
      <QuillNoSSRWrapper
        forwardedRef={quillInstance}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        placeholder="내용을 입력해주세요."
      />
    </div>
  );
};

export default QuillEditor;