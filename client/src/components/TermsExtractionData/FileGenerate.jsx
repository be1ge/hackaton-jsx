import React from "react";
import styles from './TermsExtractionData.module.css';
import QAForm from "../QA/QAForm";

const TermsExtractionData = () => {
  const downloadFile = () => {
    const file = localStorage.getItem("file_generate");
    const blob = new Blob([file], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file_generate";
    link.click();
    URL.revokeObjectURL(url);
  };

  const file = localStorage.getItem("file_generate");

  return (
    <div className={styles['thirdary']}>
      {file ? (
        <div className="" onClick={downloadFile}>
          <p>Скачать файл</p>
        </div>
      ) : null
      }
    </div>
  );
};

export default TermsExtractionData;
