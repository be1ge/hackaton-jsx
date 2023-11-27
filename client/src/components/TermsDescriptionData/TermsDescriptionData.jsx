import React from 'react';
import styles from './TermsDescriptionData.module.css';

export default function TermsDescriptionData({ scrollToTerm }) {
  if (!localStorage.getItem('termsDescriptionData')) {
    return null;
  }

  const parse = JSON.parse(localStorage.getItem('termsDescriptionData'));
  const termsDescrFromText = parse['terms_descr_from_text'];


  return (
    <div className={styles['glossarium']}>
      {Object.keys(termsDescrFromText).map((termKey) => (
        <div key={termKey}>
          <h3 onClick={() => handleHeadingClick(termKey)}>{termKey}</h3>
          {termsDescrFromText[termKey].map((item, index) => (
            <div key={index} className={styles['glossarium-item']}>
              <p>{item['descr']}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
