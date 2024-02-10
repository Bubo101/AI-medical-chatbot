// FormatMessage.js
import React from 'react';
import { decode } from 'html-entities';

const FormatMessage = ({ content }) => {
  // Function to format message content
  const formatContent = (content) => {
    let decodedContent = decode(content); // Decode HTML entities

    // Bold text surrounded by **
    decodedContent = decodedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Adjust spacing after each numbered item to have one empty line
    let formattedContent = decodedContent.replace(/(\d+\..+?)(?=\n\d+\.|\n\n|$)/g, '$1\n');

    return { __html: formattedContent.replace(/\n/g, '<br/>') }; // Convert new lines to <br/> for HTML display
  };

  return <span dangerouslySetInnerHTML={formatContent(content)} />;
};

export default FormatMessage;
