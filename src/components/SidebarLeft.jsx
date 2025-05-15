export default function SidebarLeft() {
  return (
    <div className="w-64 bg-white border p-2 space-y-4 text-sm">
      <div>
        <h2 className="font-bold bg-green-600 text-white px-2 py-1">The Court</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="underline">History</a></li>
          <li><a href="#" className="underline">বাংলায় অনুবাদিত রায়</a></li>
          <li><a href="#" className="underline">Court Calendar</a></li>
          <li><a href="#" className="underline">Court Rules</a></li>
          <li><a href="#" className="underline">SCOB (Law Reports)</a></li>
          <li><a href="#" className="underline">Photo Gallery</a></li>
          <li><a href="#" className="underline">Contacts</a></li>
          <li><a href="#" className="underline">Location Map</a></li>
          <li><a href="#" className="underline">Lodge your Complaint</a></li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold bg-green-600 text-white px-2 py-1">Resources</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="underline">Speeches of the Chief Justice</a></li>
          <li><a href="#" className="underline">Annual Reports</a></li>
          <li><a href="#" className="underline">e-book</a></li>
        </ul>
      </div>
    </div>
  );
}
