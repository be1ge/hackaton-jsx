import React from 'react';

export default function TermsDescriptionData() {
    if (!localStorage.getItem('termsDescriptionData')) {
        return null;
    }
    const parse = JSON.parse(localStorage.getItem('termsDescriptionData'));
    const items = parse['terms_descr'].map((item, index) => (
        <div key={index}>
            <span value={item['term']}>{item['term']}</span>
            <p>{item['descr']}</p>
            <a href={item['link']}>Подробнее</a>
        </div>
    ));

    return <>{items}</>;
}
