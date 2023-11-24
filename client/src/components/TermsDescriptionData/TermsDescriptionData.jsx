import React from 'react';
import styles from './TermsDescriptionData.module.css';

export default function TermsDescriptionData() {
    if (!localStorage.getItem('termsDescriptionData')) {
        return null;
    }

    const parse = JSON.parse(localStorage.getItem('termsDescriptionData'));
    const items = Object.values(parse['terms_descr_from_text']).map(
        (item, index) => (
            <div key={index} className={styles['glossarium-item']}>
                <h4 value={item[0]['descr']}>{item[0]['sentence']}</h4>
                <p>{item[0]['descr']}</p>
                <a href={item[0]['link']}>Подробнее</a>
            </div>
        )
    );

    return <div className={styles['glossarium']}>{items}</div>;
}
