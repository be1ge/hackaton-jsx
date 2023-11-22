import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import HighlightedText from './components/HighlightedText/HighlightedText';

const App = () => {
  const [drag, setDrag] = useState(false);
  const [endpoints, setEndpoints] = useState(JSON.parse(localStorage.getItem('endpoints')) || null);
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
    setLoading(true);

    axios
      .post('http://localhost:3000/upload', formData)
      .then((response) => {
        console.log(response.data);
        setEndpoints(response.data);
        localStorage.setItem('endpoints', JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setDrag(false);
      });
  };

  const resetApp = () => {
    setEndpoints(null);
    localStorage.removeItem('endpoints');
    setDrag(true);
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
          endpoints ? (
            <div>
              <HighlightedText endpoints={endpoints} />
              <button onClick={resetApp}>Сбросить</button>
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
          )
        )}
      </div>
    </>
  );
};

export default App;
