import React from 'react';
import styles from './TermsDescriptionData.module.css';

export default function TermsDescriptionData() {
  if (!localStorage.getItem('termsDescriptionData')) {
    return null;
  }

  const parse = JSON.parse(localStorage.getItem('termsDescriptionData'));
  const termsDescrFromText = parse['terms_descr_from_text'];
  const termKey = Object.keys(termsDescrFromText)[0];
  const termItems = termsDescrFromText[termKey].map(
    (item, index) => (
      <div key={index} className={styles['glossarium-item']}>
        <p>{item['descr']}</p>
      </div>
    )
  );

  return (
    <div className={styles['glossarium']}>
      <h3>{termKey}</h3>
      {termItems}
    </div>
  );
}
