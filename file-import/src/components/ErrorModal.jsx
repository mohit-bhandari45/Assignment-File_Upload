/* eslint-disable react/prop-types */
import { useState } from "react";

const ErrorModal = ({ errors, onClose }) => {
  const group = {};
  errors.map((err) => {
    if (!group[err.sheet]) group[err.sheet] = [];
    group[err.sheet].push(err);
  });

  const sheetNames = Object.keys(group);
  const [activeSheet, setActiveSheet] = useState(sheetNames[0] || "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            File Validation Errors
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs for Sheets */}
        <div className="border-b mb-4 flex space-x-4">
          {sheetNames.map((sheet) => (
            <button
              key={sheet}
              onClick={() => setActiveSheet(sheet)}
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                activeSheet === sheet
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {sheet}
            </button>
          ))}
        </div>

        {/* Error List for Active Sheet */}
        <ul className="space-y-3 max-h-64 overflow-y-auto pr-4">
          {group[activeSheet]?.map((err, index) => (
            <li
              key={index}
              className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Row:</span> {err.row}
              </p>
              <p className="text-sm text-red-600">
                <span className="font-semibold">Error:</span> {err.message}
              </p>
            </li>
          ))}
        </ul>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
