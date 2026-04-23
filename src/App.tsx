import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import About from './components/About';
import LogoOptions from './components/LogoOptions';

type Page = 'landing' | 'dashboard' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<number>(2);

  useEffect(() => {
    if (!localStorage.getItem('selectedLogo')) {
      localStorage.setItem('selectedLogo', '2');
    }
  }, []);

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLogoSelect = (logoId: number) => {
    setSelectedLogo(logoId);
    localStorage.setItem('selectedLogo', logoId.toString());
  };

  return (
    <>
      {showLogoOptions && (
        <LogoOptions
          onSelect={handleLogoSelect}
          onClose={() => setShowLogoOptions(false)}
        />
      )}

      {currentPage === 'landing' && (
        <Landing
          onGetStarted={() => setCurrentPage('dashboard')}
          onAbout={() => setCurrentPage('about')}
        />
      )}

      {currentPage === 'about' && (
        <About onBack={handleBackToLanding} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard onBack={handleBackToLanding} />
      )}
    </>
  );
}

export default App;
