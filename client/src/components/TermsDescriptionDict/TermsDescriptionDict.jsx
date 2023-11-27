import React from 'react'; 
import styles from './TermsDescriptionDict.module.css'; 
 
export default function TermsDescriptionDict() { 
  if (!localStorage.getItem('termsDescriptionData')) { 
    return null; 
  } 
 
  const parse = JSON.parse(localStorage.getItem('termsDescriptionData')); 
  const termsDescrFromDict = parse['terms_descr_from_dict']; 
 
  const termItems = Object.keys(termsDescrFromDict).map((termKey) => { 
    return termsDescrFromDict[termKey].map((item, index) => ( 
      <div key={index} className={styles['glossarium-item']}> 
        <h3>{termKey}</h3> 
        <p>{item['descr']}</p> 
      </div> 
    )); 
  }); 
 
  return ( 
    <div className={styles['glossarium']}> 
      {termItems} 
    </div> 
  ); 
}
