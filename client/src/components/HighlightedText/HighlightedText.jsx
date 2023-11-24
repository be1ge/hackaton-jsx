import React from 'react';

export default function HighlightedText() {
  const parse = JSON.parse(localStorage.getItem('transcribationData'));
  const items = parse['text'].map((item, index) => (
    <span key={index} value={item[0]}>
      {item[2]}
    </span>
  ));

  if (!localStorage.getItem('transcribationData')) {
    return null;
  }

  return <p>{items}</p>;
}
