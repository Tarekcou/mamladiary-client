import { useTranslation } from "react-i18next";

export default function SidebarLeft() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 w-full  bg-white px-2 text-sm">
      <div>
        <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
          {t("the court")}
        </h2>
        <ul className="space-y-2 mt-2 p-2 list-disc list-inside">
          <li>
            <a href="#" className="underline">
              {t("history")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("court calendar")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("citizen charter")}
            </a>
          </li>
          
          <li>
            <a href="#" className="underline">
              {t("court rules")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("photo gallery")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("contacts")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("location map")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("lodge your complaint")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("opinion")}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="bg-green-600 px-2 py-1 font-bold text-white">
          {t("resources")}
        </h2>
        <ul className="space-y-2 mt-2 p-2 list-disc list-inside">
          <li>
            <a href="#" className="underline">
              {t("speeches of the chief justice")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("annual reports")}
            </a>
          </li>
          <li>
            <a href="#" className="underline">
              {t("e-book")}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
