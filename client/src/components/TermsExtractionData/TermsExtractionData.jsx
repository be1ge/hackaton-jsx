import React from 'react';
import styles from './TermsExtractionData.module.css';


export default function TermsExtractionData() {
    return (
        <>
            <div className={styles['thirdary']}>
                <button onClick={generateDOCX}>Создать конспект</button>
            </div>
        </>
    );
}
