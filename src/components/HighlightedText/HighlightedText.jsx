import React from 'react';
function getTrancribedData(data) {
    const transcribationOutputText =
        data.headings_output.text_fragments_info[0].text;
    const transcribationOutputTitle =
        data.headings_output.text_fragments_info[0].title;
    const termsAndSubstr = data.terms_description_output.terms_descr.map(
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

const trancribedData = {
    transcribation_input: { user_id: 123, file_id: 456 },
    transcribation_output: {
        text: 'Также вы можете скачать, например, такую программу как Visual Studio и я конкретно, например, в этом курсе буду использовать такую программу как PyCharm, это полноценная IDE, то есть это полноценная среда разработки, в которой я как раз и буду прописывать весь код и здесь же в этой же программе у меня будет встроенный терминал, через который я и буду запускать все мои будущие программки.',
    },
    terms_extraction_input: { user_id: 123, file_id: 456 },
    terms_extraction_output: {
        terms_info: [
            {
                substr: 'Visual Studio',
                offsets: [55, 68],
                tag: 'NAME',
                proba: 0.9,
            },
            { substr: 'PyCharm', offsets: [145, 152], tag: 'NAME', proba: 0.9 },
            { substr: 'IDE', offsets: [170, 173], tag: 'TERM', proba: 0.9 },
            {
                substr: 'среда разработки',
                offsets: [199, 215],
                tag: 'TERM',
                proba: 0.9,
            },
            {
                substr: 'терминал',
                offsets: [320, 328],
                tag: 'TERM',
                proba: 0.9,
            },
        ],
    },
    terms_description_input: { user_id: 123, file_id: 456 },
    terms_description_output: {
        terms_descr: [
            {
                term: 'Visual Studio',
                link: 'https://ru.wikipedia.org/wiki/Microsoft_Visual_Studio',
                descr: 'Microsoft Visual Studio — линейка продуктов компании Microsoft, включающих интегрированную среду разработки (IDE) программного обеспечения и ряд других инструментов.',
            },
            {
                term: 'PyCharm',
                link: 'https://ru.wikipedia.org/wiki/PyCharm',
                descr: 'PyCharm — это кроссплатформенная интегрированная среда разработки для языка программирования Python.',
            },
            {
                term: 'IDE',
                link: 'https://ru.wikipedia.org/wiki/Интегрированная_среда_разработки',
                descr: 'Интегри́рованная среда́ разрабо́тки, ИСP (англ. integrated development environment — IDE), также единая среда разработки, ЕСР — комплекс программных средств, используемый программистами для разработки программного обеспечения (ПО).',
            },
            {
                term: 'среда разработки',
                link: 'https://ru.wikipedia.org/wiki/Интегрированная_среда_разработки',
                descr: 'Интегри́рованная среда́ разрабо́тки, ИСP (англ. integrated development environment — IDE), также единая среда разработки, ЕСР — комплекс программных средств, используемый программистами для разработки программного обеспечения (ПО).',
            },
            {
                term: 'терминал',
                link: 'https://ru.wikipedia.org/wiki/Компьютерный_терминал',
                descr: 'Компьютерный термина́л, оконечное устройство (встречаются также названия дисплейная станция, дисплей, дисплей-консоль, консоль оператора, пульт оператора) — устройство, используемое для взаимодействия пользователя (или оператора) с компьютером или компьютерной системой, локальной или удалённой (см. интерфейс пользователя).',
            },
        ],
    },
    headings_input: { user_id: 123, file_id: 456 },
    headings_output: {
        text_fragments_info: [
            {
                title: 'Среды разработки, которые мы будем использовать',
                text: 'Также вы можете скачать, например, такую программу как Visual Studio и я конкретно, например, в этом курсе буду использовать такую программу как PyCharm, это полноценная IDE, то есть это полноценная среда разработки, в которой я как раз и буду прописывать весь код и здесь же в этой же программе у меня будет встроенный терминал, через который я и буду запускать все мои будущие программки.',
            },
        ],
    },
};

const result = getTrancribedData(trancribedData);

export default function HighlightedText() {
    return (
        <>
            <h2>{result.transcribationOutputTitle}</h2>
            {result.transcribationOutputText}
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
