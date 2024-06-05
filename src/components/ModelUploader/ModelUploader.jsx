import React, { useRef, useState } from "react";
import axios from "../../axios";

import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";

import styles from "./ModelUploader.module.scss";

const ModelUploader = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [modelFile, setModelFile] = useState(null);
  const [textureFile, setTextureFile] = useState(null);

  const inputModelRef = useRef(null);
  const inputTextureRef = useRef(null);

  const handleModelChange = (e) => {
    setModelFile(e.target.files[0]);
  };

  const handleTextureChange = (e) => {
    setTextureFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!modelFile) {
      setError("Пожалуйста, выберите и загрузите файлы!");
      return;
    }

    const formData = new FormData();
    formData.append("model", modelFile);
    formData.append("modelFileName", modelFile.name);
    if (textureFile) {
      formData.append("texture", textureFile);
      formData.append("textureFileName", textureFile.name);
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post("/upload/modelname", { modelFileName: modelFile.name });

      const response = await axios.post("/upload/model", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpload(response.data);
      setSuccess(true);
    } catch (error) {
      setError("Ошибка при загрузке файла");
      alert("Ошибка!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Grid container className={styles.buttons}>
        <div>
          <Button
            onClick={() => inputModelRef.current.click()}
            variant="outlined"
            size="large"
          >
            Загрузить модель
          </Button>
          <input
            ref={inputModelRef}
            type="file"
            onChange={handleModelChange}
            accept=".obj,.stl,.gltf,.glb"
            hidden
          />
        </div>
        <div>
          <Button
            onClick={() => inputTextureRef.current.click()}
            variant="outlined"
            size="large"
          >
            Загрузить текстуру
          </Button>
          <input
            ref={inputTextureRef}
            type="file"
            onChange={handleTextureChange}
            accept="image/*"
            hidden
          />
        </div>
        <Button
          variant="outlined"
          color="success"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Загрузка..." : "Загрузить файлы"}
        </Button>
      </Grid>
      <div>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Файлы успешно загружены!</Alert>}
      </div>
    </div>
  );
};

export default ModelUploader;
