export default function SidebarLeft() {
  return (
    <div className="space-y-4 px-2 bg-white  text-sm">
      <div>
        <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
          The Court
        </h2>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <a href="#" className="underline">
              History
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              বাংলায় অনুবাদিত রায়
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Court Calendar
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Court Rules
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              SCOB (Law Reports)
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Photo Gallery
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Contacts
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Location Map
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Lodge your Complaint
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
          Resources
        </h2>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <a href="#" className="underline">
              Speeches of the Chief Justice
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              Annual Reports
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              e-book
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
