import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import image from "./assets/image.svg";
import "./App.css";

function sendFile(acceptedFiles) {
  if (acceptedFiles[0].type.slice(0, 6) !== "image/") return;
  const formData = new FormData();
  formData.append("file", acceptedFiles[0]);
  fetch("/upload", {
    method: "post",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log("http://localhost:3000" + data.url));
  // .then((data) => console.log(window.location.origin + data.url));
}

function App() {
  const onDrop = useCallback(sendFile, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <article>
      <h1>Upload your image</h1>
      <p>File should be Jpeg, Png,...</p>
      <label
        {...{
          ...getRootProps(),
          className: "drop-image-uploader",
          onClick: (e) => e.preventDefault(),
        }}
      >
        <input
          {...{
            ...getInputProps(),
            multiple: false,
            id: "image1",
            name: "image",
            accept: "image/*",
            "aria-label": "Upload Image",
            encType: "multipart/form-data",
          }}
        />
        <img src={image} alt="" />
        <span>Drag & Drop your image here</span>
      </label>
      <span>or</span>
      <label className="btn-image-uploader">
        <input
          type="file"
          id="image2"
          name="image"
          accept="image/*"
          aria-label="Upload Image"
          encType="multipart/form-data"
          onChange={(e) => sendFile(e.target.files)}
        />
      </label>
    </article>
  );
}

export default App;
