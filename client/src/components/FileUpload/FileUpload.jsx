import React, { useState } from 'react';
import axios from 'axios';
import HighlightedText from '../HighlightedText/HighlightedText';
import TermsDescriptionData from '../TermsDescriptionData/TermsDescriptionData';
import TermsExtractionData from '../TermsExtractionData/TermsExtractionData';
import styles from './FileUpload.module.css';

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
        formData.append('fl', file);

        axios
            .post(
                'https://04c0-93-175-29-74.ngrok-free.app/transcribation?user_id=123&file_id=456',
                formData
            )
            .then((response) => {
                console.log('Ответ от /transcribation:', response.data);
                const transcribationData = JSON.stringify(response.data);
                localStorage.setItem('transcribationData', transcribationData);
                setTranscribationData(transcribationData);
                console.log(typeof response.data);
                setTimeout(() => {
                    axios
                        // .post('http://localhost:3000/termsExtraction')
                        .post(
                            'https://04c0-93-175-29-74.ngrok-free.app/terms_extraction?user_id=123&file_id=456',
                            formData
                        )
                        .then((response) => {
                            console.log(
                                'Ответ от /termsExtraction:',
                                response.data
                            );
                            const termsExtractionData = response.data;
                            localStorage.setItem(
                                'termsExtractionData',
                                termsExtractionData
                            );
                            setTermsExtractionData(termsExtractionData);
                            console.log(typeof response.data);

                            setTimeout(() => {
                                axios
                                    .post(
                                        // 'http:localhost:3000/termsDescription',
                                        'https://04c0-93-175-29-74.ngrok-free.app/terms_description?user_id=123&file_id=456',
                                        formData
                                    )
                                    .then((response) => {
                                        console.log(
                                            'Ответ от /termsDescription:',
                                            response.data
                                        );
                                        const termsDescriptionData =
                                            response.data;
                                        localStorage.setItem(
                                            'termsDescriptionData',
                                            termsDescriptionData
                                        );
                                        setTermsDescriptionData(
                                            termsDescriptionData
                                        );
                                        setTimeout(() => {
                                            axios
                                                .post(
                                                    // 'http:localhost:3000/termsDescription',
                                                    'https://04c0-93-175-29-74.ngrok-free.app/headings?user_id=123&file_id=456',
                                                    formData
                                                )
                                                .then((response) => {
                                                    console.log(
                                                        'Ответ от /headings:',
                                                        response.data
                                                    );
                                                    const headings =
                                                        response.data;
                                                    localStorage.setItem(
                                                        'headings',
                                                        headings
                                                    );
                                                    setTimeout(() => {
                                                        axios
                                                            .post(
                                                                // 'http:localhost:3000/termsDescription',
                                                                'https://04c0-93-175-29-74.ngrok-free.app/QA_generation?user_id=123&file_id=456',
                                                                formData
                                                            )
                                                            .then(
                                                                (response) => {
                                                                    console.log(
                                                                        'Ответ от /QA_generation:',
                                                                        response.data
                                                                    );
                                                                    const QA_generation =
                                                                        response.data;
                                                                    localStorage.setItem(
                                                                        'QA_generation',
                                                                        QA_generation
                                                                    );
                                                                    setTimeout(
                                                                        () => {
                                                                            axios
                                                                                .post(
                                                                                    // 'http:localhost:3000/termsDescription',
                                                                                    'https://04c0-93-175-29-74.ngrok-free.app/file_generate?user_id=123&file_id=456',
                                                                                    formData
                                                                                )
                                                                                .then(
                                                                                    (
                                                                                        response
                                                                                    ) => {
                                                                                        console.log(
                                                                                            'Ответ от /file_generate:',
                                                                                            response.data
                                                                                        );
                                                                                        const file_generate =
                                                                                            response.data;
                                                                                        localStorage.setItem(
                                                                                            'file_generate',
                                                                                            file_generate
                                                                                        );
                                                                                    }
                                                                                )
                                                                                .catch(
                                                                                    (
                                                                                        error
                                                                                    ) => {
                                                                                        console.error(
                                                                                            'Ошибка при запросе на /file_generate:',
                                                                                            error
                                                                                        );
                                                                                    }
                                                                                );
                                                                        },
                                                                        0
                                                                    );
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                console.error(
                                                                    'Ошибка при запросе на /QA_generation:',
                                                                    error
                                                                );
                                                            });
                                                    }, 0);
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        'Ошибка при запросе на /headings:',
                                                        error
                                                    );
                                                });
                                        }, 0);
                                    })
                                    .catch((error) => {
                                        console.error(
                                            'Ошибка при запросе на /termsDescription:',
                                            error
                                        );
                                    });
                            }, 0);
                        })
                        .catch((error) => {
                            console.error(
                                'Ошибка при запросе на /termsExtraction:',
                                error
                            );
                        });
                }, 0);
            })
            .catch((error) => {
                console.error('Ошибка при запросе на /transcribation:', error);
            });
    };

    return (
        <>
            {drag ? (
                <>
                <div
                    className="drop-area"
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                    onDrop={onDropHandler}
                >
                    <img src="./public/cloud.svg" alt="" />
                </div>
                    <h1 className='logo'>Pine Forest AI</h1>
                    </>
            ) : termsDescriptionData ? (
                <div className="app_wrapper2">
                    <div>
                        <HighlightedText />
                    </div>
                    <div className={styles['secondary']}>
                        <div>
                            <TermsExtractionData />
                        </div>
                        <div>
                            <TermsDescriptionData />
                        </div>
                    </div>
                </div>
            ) : termsExtractionData ? (
                <div className="app_wrapper2">
                    <div>
                        <HighlightedText />
                    </div>
                    <div className={styles['secondary']}>
                        <div>
                            <TermsExtractionData />
                        </div>
                        <div>
                            <TermsDescriptionData />
                        </div>
                    </div>
                </div>
            ) : transcribationData ? (
                <div className="app_wrapper2">
                    <div>
                        <HighlightedText />
                    </div>
                    <div className={styles['secondary']}>
                        <div>
                            <TermsExtractionData />
                        </div>
                        <div>
                            <TermsDescriptionData />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='app_wrapper'>
                <div
                    className="drop-area"
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                    onClick={openFileBrowser}
                    >
                    <img src="./public/cloud.svg" alt="" />
                </div>
                    <h1 className='logo'>Pine Forest AI</h1>
            </div>
            )}
        </>
    );
};
