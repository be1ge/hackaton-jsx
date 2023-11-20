import React, { useRef } from "react";

export const FileUpload = () => {
    const fileComponent = useRef();
    const handlerSubmit = (e) => {
        e.preventDefault();
        console.log(fileComponent.current.files[0]);
    };
    return (
        <form className="file-upload" onSubmit={handlerSubmit}>
            <input type="file" id="file-loader-button" className="input" ref={fileComponent}>Выберите файл</input>
        </form>
    );
}