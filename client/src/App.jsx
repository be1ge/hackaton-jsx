import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import HighlightedText from './components/HighlightedText/HighlightedText';
const App = () => {
  const [drag, setDrag] = useState(false);
  const [endpoints, setEndpoints] = useState(
    JSON.parse(localStorage.getItem('endpoints')) || null
  );
  const [loading, setLoading] = useState(false);

  const openFileBrowser = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
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
    let files = [...e.dataTransfer.files];
    console.log(files);
    const formData = new FormData();
    formData.append('files', files[0]);
    setLoading(true);

    axios
      // .post('https://c9ff-93-175-29-74.ngrok-free.app/transcribation?user_id=123&file_id=456', formData)
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
  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("files", file);
    setLoading(true);
  
    axios
      // .post('https://c9ff-93-175-29-74.ngrok-free.app/transcribation?user_id=123&file_id=456', formData)
      .post("http://localhost:3000/upload", formData)
      .then((response) => {
        console.log(response.data);
        setEndpoints(response.data);
        localStorage.setItem("endpoints", JSON.stringify(response.data));
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
    setDrag(false);
  };

  return (
    <>
      <div className="app">
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
        ) : endpoints ? (
          <div>
            <HighlightedText endpoints={endpoints} />
            <button onClick={resetApp}>Сбросить</button>
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
      </div>
    </>
  );
};

export default App;
