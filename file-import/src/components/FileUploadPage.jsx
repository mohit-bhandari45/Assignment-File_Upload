import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { uploadAPI } from "../services/api";
import DataPreview from "./DataPreview";
import ErrorModal from "./ErrorModal";
import ImportButton from "./ImportButton";
import ImportNew from "./ImportNew";
import { IconUpload } from "@tabler/icons-react";

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [close, setClose] = useState(true);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
    uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(uploadAPI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data.sheets);
      setErrors(response.data.errors);
      setClose(false);
      setActiveSheet(Object.keys(response.data.sheets)[0] || null);
    } catch (error) {
      console.error(error);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: ".xlsx",
    maxSize: 2 * 1024 * 1024,
  });

  const onClose = () => {
    setClose(true);
  };

  const refresh = () => {
    setData(null);
    setActiveSheet(null);
    setFile(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {!data && !activeSheet && (
        <div className="flex flex-col items-center">
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-200 bg-gray-50"
          >
            <input {...getInputProps()} />
            <IconUpload className="text-blue-500 mb-2" size={40} />
            <p className="text-lg font-medium text-gray-700">
              Drag & drop an Excel file here
            </p>
            <p className="text-sm text-gray-500">or click to select</p>
            <p className="text-sm text-gray-500 mt-2">
              Only .xlsx files, max 2MB
            </p>
          </div>
          {file && (
            <p className="mt-4 text-green-600 font-semibold">
              Selected File: {file.name}
            </p>
          )}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      )}

      {!close && errors.length > 0 && (
        <ErrorModal errors={errors} onClose={onClose} />
      )}

      {data && activeSheet && (
        <div className="mt-6">
          <DataPreview
            sheets={data}
            activeSheet={activeSheet}
            setActiveSheet={setActiveSheet}
            setSheets={setData}
          />
        </div>
      )}

      {data && (
        <div className="flex gap-4 mt-6 justify-center">
          <ImportButton data={data} onRefresh={refresh} />
          {activeSheet && <ImportNew onRefresh={refresh} />}
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
