import React from 'react';

export default function HighlightedText({ endpoints }) {
    // Функция для обработки данных и получения нужных значений
    if (!endpoints) {
        return null;
    }
    function getTrancribedData(endpoints) {
        const transcribationOutputText =
            endpoints.headings_output.text_fragments_info[0].text;
        const transcribationOutputTitle =
            endpoints.headings_output.text_fragments_info[0].title;
        const termsAndSubstr =
            endpoints.terms_description_output.terms_descr.map(
                (terms_descr) => {
                    return {
                        term: terms_descr.term,
                        descr: terms_descr.descr,
                        link: terms_descr.link,
                    };
                }
            );

        return {
            transcribationOutputText,
            termsAndSubstr,
            transcribationOutputTitle,
        };
    }

    // Вызываем функцию для обработки переданных данных
    const result = getTrancribedData(endpoints);

    return (
        <>
            <h2>{result.transcribationOutputTitle}</h2>
            <p>{result.transcribationOutputText}</p>

            <div>
                {result.termsAndSubstr.map((item, index) => (
                    <div key={index}>
                        <h3>{item.term}</h3>
                        <p>{item.descr}</p>
                        <a href={item.link}>Источник</a>
                    </div>
                ))}
            </div>
        </>
    );
}
