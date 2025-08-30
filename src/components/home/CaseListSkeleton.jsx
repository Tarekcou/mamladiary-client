const CaseListSkeleton = ({ rows = 8 }) => {
  const labels = [
    "mamla name",
    "mamla no",
    "mamla year",
    "district",
    "next date",
    "completion stage",
    "completion date",
    "comments",
  ];

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="shadow border border-gray-300 rounded-lg min-w-full text-base md:text-lg table-auto">
        <tbody>
          {labels.map((label, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? "bg-gray-200 text-center"
                  : "bg-gray-50 text-center"
              }
            >
              <td className="px-4 py-2 font-medium">
                <div className="bg-gray-300 mx-auto rounded w-32 h-4 animate-pulse"></div>
              </td>
              <td className="px-4 py-2">
                <div className="bg-gray-200 rounded w-full h-4 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseListSkeleton;
