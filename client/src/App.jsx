import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import HighlightedText from './components/HighlightedText/HighlightedText';

const App = () => {
  const [drag, setDrag] = useState(false);
  const [endpoints, setEndpoints] = useState(null);
  const [loading, setLoading] = useState(false);

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
    let files = [...e.dataTransfer.files];
    console.log(files);
    const formData = new FormData();
    formData.append('file', files[0]);

    setLoading(true); // Устанавливаем состояние загрузки перед запросом

    axios
      .post('http://localhost:3000/upload', formData)
      .then((response) => {
        console.log(response.data);
        setEndpoints(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); // Завершаем состояние загрузки после получения ответа
      });

    setDrag(false);
  };

  return (
    <>
      <div className="app">
        {drag ? (
          <div
            className="drop-area"
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDrop={(e) => onDropHandler(e)}
          >
            Отпустите файлы, чтобы загрузить их
          </div>
        ) : (
          <div
            className="drop-area"
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
          >
            Перетащите файлы, чтобы загрузить их
          </div>
        )}
      </div>
      {loading ? (
        <div>Loading...</div> // Отображаем "Loading..." во время загрузки данных
      ) : (
        <HighlightedText endpoints={endpoints} /> // Передаем данные в компонент HighlightedText
      )}
    </>
  );
};

export default App;
