export default function SidebarRight() {
  return (
    <div className="w-64 bg-gray-100 border p-2 space-y-4 text-sm">
      <div>
        <h2 className="font-bold bg-green-600 text-white px-2 py-1">Judges' List</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="underline">Appellate Division</a></li>
          <li><a href="#" className="underline">High Court Division</a></li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold bg-green-600 text-white px-2 py-1">Appellate Division</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="text-red-600 underline">Cause List</a></li>
          <li><a href="#" className="underline">Monthly List</a></li>
          <li><a href="#" className="underline">Judgments and Orders</a></li>
        </ul>
      </div>
    </div>
  );
}
