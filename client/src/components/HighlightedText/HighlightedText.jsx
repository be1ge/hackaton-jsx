import React from 'react';
import styles from './HighlightedText.module.css'

export default function HighlightedText() {
    const parse = JSON.parse(localStorage.getItem('transcribationData'));
    const items = parse['raw_text'];

    if (!localStorage.getItem('transcribationData')) {
        return null;
    }

    return (
      <div className={styles['styled-scrollbars']}>
        <div className={styles['transcribation']}>
            <textarea id="highlightedtext" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off">{items}</textarea>
        </div>
      </div>
    );
}
