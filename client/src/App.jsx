import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import image from "./assets/image.svg";

function App() {
  const [state, setState] = useState("");
  const [imgURL, setImgURL] = useState("");
  const onDrop = useCallback(sendFile, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function sendFile(acceptedFiles) {
    const file = acceptedFiles[0];
    if (file.type.slice(0, 6) !== "image/") return;
    setState("pending");
    const formData = new FormData();
    formData.append("file", file);
    fetch("/api/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setImgURL(window.location.origin + data.url);
        setState("fulfilled");
      });
  }

  const labelAttr = {
    ...getRootProps(),
    className: "drop-image-uploader",
    onClick: (e) => e.preventDefault(),
  };
  const inputAttr = {
    ...getInputProps(),
    id: "image1",
    name: "image1",
    "aria-label": "Upload Image",
    encType: "multipart/form-data",
  };
  if (state === "pending") {
    return (
      <article className="uploading">
        <p>Uploading...</p>
        <progress id="progress-bar" aria-label="Content loading…"></progress>
      </article>
    );
  }
  if (state === "fulfilled") {
    return (
      <article className="uploaded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="48px"
          height="48px"
        >
          <path
            fill="#c8e6c9"
            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
          />
          <path
            fill="#4caf50"
            d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
          />
        </svg>
        <p>Updated Successfully</p>
        <img src={imgURL} alt="" />
        <div className="copy" data-imgURL={imgURL}>
          {/* <input value={imgURL} type="text" name="" id="" /> */}

          <button
            onClick={() => {
              navigator.clipboard.writeText(imgURL);
              console.log(imgURL);
            }}
          >
            Copy Link
          </button>
        </div>
      </article>
    );
  }
  return (
    <article>
      <h1>Upload your image</h1>
      <p>File should be Jpeg, Png,...</p>
      <label {...labelAttr}>
        <input {...inputAttr} />
        <img src={image} alt="" />
        <span>Drag & Drop your image here</span>
      </label>
      <span>or</span>
      <label className="btn-image-uploader">
        <input
          type="file"
          id="image2"
          name="image2"
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
