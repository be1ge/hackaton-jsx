import React, { useState } from 'react';
import './App.css';
import HighlightedText from './components/HighlightedText/HighlightedText';
import axios from 'axios';

function App() {
    const [drag, setDrag] = useState(false);

    function dragStartHandler(e) {
        e.preventDefault();
        setDrag(true);
    }

    function dragLeaveHandler(e) {
        e.preventDefault();
        setDrag(false);
    }

    function onDropHandler(e) {
      e.preventDefault();
      let files = [...e.dataTransfer.files];
      const formData = new FormData();
      formData.append('file', files[0]);
      axios.post('url', formData);
      console.log(files)
      setDrag(false);
    }
    return (
        <>
            <div className="app">
                {drag ? (
                    <div
                        className="drop-area"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                        onDrop={e => onDropHandler(e)}
                    >
                        Отпустите файлы, чтобы загрузить их
                    </div>
                ) : (
                    <div
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                    >
                        Перетащите файлы, чтобы загрузить их
                    </div>
                )}
            </div>
            <HighlightedText>

            </HighlightedText>
        </>
    );
}

export default App;
