const CaseListSkeleton = ({ rows = 2, columns = 6 }) => {
  return (
    <div className="min-w-full overflow-x-auto">
      <table className="border border-gray-200 rounded-lg min-w-full max-w-screen text-sm table-auto">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th key={colIndex} className="px-4 py-2 text-left">
                <div className="bg-gray-300 rounded w-24 h-4 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-gray-200 border-t animate-pulse"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div className="bg-gray-200 rounded w-full h-4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseListSkeleton;
