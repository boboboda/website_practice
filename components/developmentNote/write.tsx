"use client"

import React, { useState } from 'react';
import { Button, Spacer } from '@nextui-org/react';
import QuillEditor from '../../components/developmentNote/QuillEditor';

const WritePage: React.FC = () => {
  const [content, setContent] = useState<string>('');

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = () => {
    console.log('Submitted content:', content);
    // 여기에 서버로 데이터 전송 로직 추가
  };

  return (
    <div>
      <h1>글쓰기 페이지</h1>
      <QuillEditor value={content} onChange={handleContentChange} />
      <Spacer y={1} />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default WritePage;
