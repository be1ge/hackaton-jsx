import React, { useState } from 'react';
import axios from 'axios';
import styles from './QAForm.module.css';

export default function QAForm() {
  const [chosenQuestions, setChosenQuestions] = useState([]);

  const qaGenerations = JSON.parse(localStorage.getItem('QA_generation'));
  const generatedQA = qaGenerations && qaGenerations.generated_QA;

  if (!generatedQA) {
    return null;
  }

  const questions = generatedQA[0].questions;

  const handleCheckboxChange = (question) => {
    if (chosenQuestions.includes(question)) {
      setChosenQuestions(chosenQuestions.filter((q) => q !== question));
    } else {
      setChosenQuestions([...chosenQuestions, question]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {
      chosen_qa: chosenQuestions,
    };

    const url = 'https://9fc1-93-175-29-74.ngrok-free.app/';
    axios
      .post(url + 'docx_generate?user_id=123&file_id=456', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Устанавливаем responseType на 'blob'
      })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/docx' }); // Создаем Blob из полученных данных
        const fileURL = window.URL.createObjectURL(file); // Создаем URL ссылку на Blob
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', 'generated_file.docx'); // Устанавливаем имя файла для скачивания
        document.body.appendChild(link); // Добавляем ссылку в документ
        link.click(); // Вызываем клик по ссылке
        document.body.removeChild(link); // Удаляем ссылку из документа
      })
      .catch((error) => {
        console.error('Ошибка при запросе к API:', error);
      });
  };

  return (
    <form className={styles['form']} onSubmit={handleFormSubmit}>
      <div className={styles['checkbox-wrapper-4']}>
        {questions.map((question, index) => (
          <div key={index}>
            <input
              className={styles['inp-cbx']}
              id={`question-${index}`}
              type="checkbox"
              checked={chosenQuestions.includes(question)}
              onChange={() => handleCheckboxChange(question)}
            />
            <label className={styles['cbx']} htmlFor={`question-${index}`}>
              <span></span>
              <span>{question}</span>
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className={styles['button']}>
        <span className='actual-text'>Download</span>
      </button>
    </form>
  );
}
