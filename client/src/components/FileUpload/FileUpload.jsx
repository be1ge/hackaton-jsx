import React, { useState } from 'react';
import axios from 'axios';
import HighlightedText from '../HighlightedText/HighlightedText';
import TermsDescriptionData from '../TermsDescriptionData/TermsDescriptionData';
import TermsExtractionData from '../TermsExtractionData/TermsExtractionData';

export const FileUpload = () => {
    const [drag, setDrag] = useState(false);
    const [transcribationData, setTranscribationData] = useState(
        JSON.parse(localStorage.getItem('transcribationData')) || null
    );
    const [termsExtractionData, setTermsExtractionData] = useState(
        JSON.parse(localStorage.getItem('termsExtractionData')) || null
    );
    const [termsDescriptionData, setTermsDescriptionData] = useState(
        JSON.parse(localStorage.getItem('termsDescriptionData')) || null
    );
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const openFileBrowser = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.onchange = (e) => handleFileUpload(e.target.files[0]);
        inputElement.click();
    };

    const dragStartHandler = (e) => {
        e.preventDefault();
        setDrag(true);
    };

    const dragLeaveHandler = (e) => {
        e.preventDefault();
        setDrag(false);
    };

    const onDropHandler = (e) => {
        e.preventDefault();
        setLoading(true);
    };

    const handleFileUpload = (file) => {
        const formData = new FormData();
        formData.append('', file);

        axios
            .post('http://localhost:3000/transcribation', formData)
            .then((response) => {
                console.log('Ответ от /transcribation:', response.data);
                const transcribationData = JSON.stringify(response.data);
                localStorage.setItem('transcribationData', transcribationData);
                setTranscribationData(transcribationData);
                setTimeout(() => {
                    axios
                        .post('http://localhost:3000/termsExtraction', formData)
                        .then((response) => {
                            console.log(
                                'Ответ от /termsExtraction:',
                                response.data
                            );
                            const termsExtractionData = JSON.stringify(
                                response.data
                            );
                            localStorage.setItem(
                                'termsExtractionData',
                                termsExtractionData
                            );
                            setTermsExtractionData(termsExtractionData);
                            setTimeout(() => {
                                axios
                                    .post(
                                        'http://localhost:3000/termsDescription',
                                        formData
                                    )
                                    .then((response) => {
                                        console.log(
                                            'Ответ от /termsDescription:',
                                            response.data
                                        );
                                        const termsDescriptionData =
                                            JSON.stringify(response.data);
                                        localStorage.setItem(
                                            'termsDescriptionData',
                                            termsDescriptionData
                                        );
                                        setTermsDescriptionData(
                                            termsDescriptionData
                                        );
                                    })
                                    .catch((error) => {
                                        console.error(
                                            'Ошибка при запросе на /termsDescription:',
                                            error
                                        );
                                    });
                            }, 3000);
                        })
                        .catch((error) => {
                            console.error(
                                'Ошибка при запросе на /termsExtraction:',
                                error
                            );
                        });
                }, 3000);
            })
            .catch((error) => {
                console.error('Ошибка при запросе на /transcribation:', error);
            });
    };

    const resetApp = () => {
        setDrag(false);
        setData(null);
    };

    return (
        <>
            {drag ? (
                <div
                    className="drop-area"
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                    onDrop={onDropHandler}
                >
                    Отпустите файлы, чтобы загрузить их
                </div>
            ) : termsDescriptionData ? (
                <div className="app_wrapper">
                    <HighlightedText data={transcribationData} />
                    <TermsExtractionData data={termsExtractionData} />
                    <TermsDescriptionData data={termsDescriptionData} />
                </div>
            ) : termsExtractionData ? (
                <div className="app_wrapper">
                    <HighlightedText data={transcribationData} />
                    <TermsExtractionData data={termsExtractionData} />
                    <TermsDescriptionData data={termsDescriptionData} />
                </div>
            ) : transcribationData ? (
                <div className="app_wrapper">
                    <HighlightedText data={transcribationData} />
                    <TermsExtractionData data={termsExtractionData} />
                    <TermsDescriptionData data={termsDescriptionData} />
                </div>
            ) : (
                <div
                    className="drop-area"
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                    onClick={openFileBrowser}
                >
                    Перетащите файлы, чтобы загрузить их
                </div>
            )}
        </>
    );
};
