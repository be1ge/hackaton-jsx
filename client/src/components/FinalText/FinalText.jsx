import React from 'react';
import styles from './FinalText.module.css'

export default function HighlightedText() {
  const parse = JSON.parse(localStorage.getItem('headings'));
  const items = parse['text_fragments_info'].map((fragment) => fragment['text']);

  if (!localStorage.getItem('headings')) {
    return null;
  }

  return (
    <div className={styles['styled-scrollbars']}>
      <div className={styles['transcribation']}>
        <textarea spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off">{items.join('\n')}</textarea>
      </div>
    </div>
  );
}
