/* eslint-disable react/prop-types */
import axios from "axios";
import { importAPI } from "../services/api";
import { toast } from "react-toastify";
import { useState } from "react";

const ImportButton = ({ data, onRefresh }) => {
  const [disable, setDisable] = useState(false);

  const handleImport = async () => {
    try {
      const response = await axios.post(importAPI, data);
      if (response.data.validRows > 0) {
        toast.success("Data imported successfully");
      } else {
        toast.error("Data cannot be imported! Please add a new valid File");
        onRefresh();
      }
      setDisable(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to import data.");
    }
  };
  return (
    <button
      onClick={handleImport}
      disabled={disable}
      className={`${
        disable ? "bg-gray-500" : "bg-blue-900 hover:bg-blue-950 cursor-pointer"
      } mt-4 py-2 px-4 font-[Helvetica] text-white rounded-lg`}
    >
      {disable ? "Data Imported" : "Import Data"}
    </button>
  );
};

export default ImportButton;
