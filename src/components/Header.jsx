
import banner from '../assets/banner.jpg';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'bn' : 'en');
  };
  return (
    <header className="w-full shadow-md">

        <div
  className="hero h-64"
  style={{
backgroundImage: `url(${banner})`,  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-5xl   ">
      <h1 className="mb-5 text-4xl font-bold text-gray-200">{t('title')}</h1>
      <h1 className="mb-5 text-xl font-bold text-gray-200">{t('haeding')}</h1>
           
      
    </div>
  </div>
</div>
     
      {/* Navbar Menus */}
      <nav className="navbar flex justify-between items-center bg-base-100 border-t border-gray-300 px-4">
        
        <div className="flex gap-4">
                      <a className="btn btn-ghost btn-sm rounded-btn">{t('Home')}</a>

          <a className="btn btn-ghost btn-sm rounded-btn">History</a>
          <a className="btn btn-ghost btn-sm rounded-btn">Forms</a>
          <a className="btn btn-ghost btn-sm rounded-btn">E-application</a>
          <a className="btn btn-ghost btn-sm rounded-btn">Judgments</a>
          <a className="btn btn-ghost btn-sm rounded-btn">Cause List</a>
        </div>

        {/* text change */}
         <button onClick={toggleLanguage} className="btn btn-sm ">
              {i18n.language === 'en' ? 'বাংলা' : 'English'}
            </button>
      </nav>
    </header>
  );
}
