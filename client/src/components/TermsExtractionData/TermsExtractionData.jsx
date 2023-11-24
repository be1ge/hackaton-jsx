import React from 'react';

export default function TermsExtractionData() {
    if (!localStorage.getItem('termsExtractionData')) {
        return null;
    }
    const parse = JSON.parse(localStorage.getItem('termsExtractionData'));
    const items = Object.entries(parse['terms_info']).map(
        ([key, value], index) => (
            <div key={index}>
                <p value={value}>{key}</p>
                <p></p>
            </div>
        )
    );

    return <>{items}</>;
}
