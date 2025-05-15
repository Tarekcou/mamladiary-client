export default function CaseSearchForm() {
  return (
    <div className="flex-1 p-4 bg-white border shadow">
      <div className="bg-blue-200 font-bold text-center py-2 mb-4 text-lg">Case Search</div>
      <div className="space-y-4 text-sm">
        <h3 className="font-semibold text-center text-green-600">Search by Number</h3>
        <div className="grid grid-cols-2 gap-4">
          <label>Division: <select className="select select-bordered w-full"></select></label>
          <label>Case Category: <select className="select select-bordered w-full"></select></label>
          <label className="col-span-2">Case Type: <select className="select select-bordered w-full"></select></label>
          <label className="col-span-2">Case Number: <input className="input input-bordered w-full" /></label>
          <label className="col-span-2">Year: <input className="input input-bordered w-full" value="2025" /></label>
        </div>
        <button className="btn btn-primary mt-2">Search</button>
      </div>
    </div>
  );
}
