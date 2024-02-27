import React from 'react';
import { decode } from 'html-entities';

const FormatMessage = ({ content }) => {

  const formatContent = (content) => {
    let decodedContent = decode(content); 


    decodedContent = decodedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');


    let formattedContent = decodedContent.replace(/(\d+\..+?)(?=\n\d+\.|\n\n|$)/g, '$1\n');

    return { __html: formattedContent.replace(/\n/g, '<br/>') }; 
  };

  return <span dangerouslySetInnerHTML={formatContent(content)} />;
};

export default FormatMessage;
