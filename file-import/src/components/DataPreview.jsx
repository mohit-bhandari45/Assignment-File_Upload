/* eslint-disable react/prop-types */
import { useState } from "react";
import { format } from "date-fns";
import { IndianNumberFormat } from "./utilities/utils";
import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "./ConfirmDialog";

const DataPreview = ({ sheets, activeSheet, setActiveSheet, setSheets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showConfirm, setShowConfirm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const sheetData = sheets[activeSheet] || [];
  const headers = sheetData.length ? sheetData[0] : [];
  let rows = sheetData.slice(1).filter((row) => row.length > 0);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleDelete = (index) => {
    setRowToDelete(index);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const updatedRows = rows.filter((_, idx) => idx !== rowToDelete);
    setSheets({ ...sheets, [activeSheet]: [headers, ...updatedRows] });
    setShowConfirm(false);
  };

  const formatCell = (cell) => {
    if (!cell) return "-";
    if (/\d{4}-\d{2}-\d{2}/.test(cell))
      return format(new Date(cell), "dd-MM-yyyy");
    if (!isNaN(cell)) return IndianNumberFormat(cell);
    return cell;
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Sheet
        </label>
        <select
          className="w-full cursor-pointer p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={activeSheet}
          onChange={(e) => setActiveSheet(e.target.value)}
        >
          {Object.keys(sheets).map((sheet) => (
            <option key={sheet} value={sheet}>
              {sheet}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead className="bg-blue-100">
            <tr>
              {headers.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-300"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200"
                  >
                    {formatCell(cell)}
                  </td>
                ))}
                <td className="px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => handleDelete(indexOfFirstRow + rowIndex)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <IconTrash className="cursor-pointer" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 border rounded-md shadow-sm transition ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 border rounded-md shadow-sm transition ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this row?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default DataPreview;
