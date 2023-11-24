import React from 'react';
import './App.css';
import { FileUpload } from './components/FileUpload/FileUpload';
const App = () => {
  return (
    <>
      <div className="app">
        <FileUpload></FileUpload>
      </div>
    </>
  );
};

export default App;
