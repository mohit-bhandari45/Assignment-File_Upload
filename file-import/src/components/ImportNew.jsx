/* eslint-disable react/prop-types */

const ImportNew = ({ onRefresh }) => {
  return (
    <button
      onClick={() => {
        onRefresh()
      }}
      className={`bg-green-500 hover:bg-green-600 cursor-pointer mt-4 py-2 px-4 font-[Helvetica] text-white rounded-lg`}
    >
      Import New File
    </button>
  );
};

export default ImportNew;
