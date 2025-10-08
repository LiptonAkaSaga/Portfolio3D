import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundFiller from './images/fillerss.svg';
import './css/Style.css';

const NewPortfolio: React.FC = () => {
  const navigate = useNavigate();

  console.log('NewPortfolio background filler path:', backgroundFiller);

  const handleBackToMain = () => {
    navigate('/');
  };

  // Ustaw tło body dla nowej strony
  useEffect(() => {
    document.body.style.backgroundColor = '#333333';
    document.body.style.color = '#fdfff7';

    return () => {
      // Przywróć domyślne style po opuszczeniu strony
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div
      className="new-portfolio"
      style={{
        backgroundColor: '#333333', // var(--Background-color)
        color: '#fdfff7', // var(--White-color)
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <img
        src={backgroundFiller}
        alt="background"
        className="background-filler"
        onLoad={() => console.log('NewPortfolio background filler loaded successfully')}
        onError={(e) => console.error('NewPortfolio background filler failed to load:', e)}
      />
      <div className="container">
        <nav className="navbar fixed-top py-2 navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="#home">
              <h2 style={{ color: 'var(--Primary-color)' }}>Portfolio 2.0</h2>
            </a>
            <div className="navbar-nav ms-auto">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={handleBackToMain}
                style={{ fontSize: '14px', padding: '6px 12px' }}
              >
                ← Powrót do głównej
              </button>
              <a className="nav-link" href="#home">
                <span className="oneword">/</span>home
              </a>
              <a className="nav-link" href="#projects">
                <span className="oneword">/</span>projects
              </a>
              <a className="nav-link" href="#about">
                <span className="oneword">/</span>about
              </a>
              <a className="nav-link" href="#contact">
                <span className="oneword">/</span>contact
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px' }}
        >
          <div className="row align-items-center w-100">
            <div className="col-lg-8">
              <h1 className="display-3 mb-4" style={{ color: 'white' }}>
                Witaj w <strong style={{ color: 'var(--Primary-color)' }}>nowym</strong> portfolio!
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.2rem' }}>
                Ta strona została załadowana po obejrzeniu filmu wprowadzającego. Tutaj możesz
                umieścić nową wersję swojego portfolio z nowymi projektami, ulepszonymi sekcjami i
                świeżym designem.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-outline-primary btn-lg">Zobacz moje projekty</button>
                <button className="btn btn-outline-secondary btn-lg">Skontaktuj się</button>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text-center">
                <div
                  style={{
                    width: '300px',
                    height: '300px',
                    background: 'linear-gradient(45deg, var(--Primary-color), #00e061)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 20px 40px rgba(58, 41, 245, 0.3)',
                  }}
                >
                  <h2 style={{ color: 'white', fontWeight: 'bold' }}>
                    NOWE
                    <br />
                    PORTFOLIO
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        >
          <div className="w-100">
            <div className="text-center mb-5">
              <h2 className="display-4 mb-3">
                <span className="oneword">/</span>nowe projekty
              </h2>
              <p className="lead">Sprawdź moje najnowsze prace i osiągnięcia</p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100"
                  style={{
                    backgroundColor: 'var(--Background-color)',
                    border: '2px solid var(--Grey-color)',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--Primary-color)' }}>
                      Projekt A
                    </h5>
                    <p className="card-text">
                      Opis nowego projektu, który pokazuje Twoje najnowsze umiejętności i
                      technologie.
                    </p>
                    <div className="mt-auto">
                      <span className="badge" style={{ backgroundColor: 'var(--Primary-color)' }}>
                        React
                      </span>
                      <span className="badge bg-secondary ms-1">TypeScript</span>
                      <span className="badge bg-success ms-1">Node.js</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100"
                  style={{
                    backgroundColor: 'var(--Background-color)',
                    border: '2px solid var(--Grey-color)',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--Primary-color)' }}>
                      Projekt B
                    </h5>
                    <p className="card-text">
                      Kolejny projekt demonstrujący Twoje możliwości w różnych obszarach
                      programowania.
                    </p>
                    <div className="mt-auto">
                      <span className="badge" style={{ backgroundColor: 'var(--Primary-color)' }}>
                        Python
                      </span>
                      <span className="badge bg-secondary ms-1">Django</span>
                      <span className="badge bg-warning ms-1">PostgreSQL</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div
                  className="card h-100"
                  style={{
                    backgroundColor: 'var(--Background-color)',
                    border: '2px solid var(--Grey-color)',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--Primary-color)' }}>
                      Projekt C
                    </h5>
                    <p className="card-text">
                      Zaawansowany projekt pokazujący integrację różnych technologii i frameworków.
                    </p>
                    <div className="mt-auto">
                      <span className="badge" style={{ backgroundColor: 'var(--Primary-color)' }}>
                        Vue.js
                      </span>
                      <span className="badge bg-secondary ms-1">Express</span>
                      <span className="badge bg-info ms-1">MongoDB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="row align-items-center w-100">
            <div className="col-lg-6">
              <h2 className="display-4 mb-4">
                <span className="oneword">/</span>o mnie
              </h2>
              <p className="mb-4">
                Jestem pasjonatem programowania z wieloletnim doświadczeniem w tworzeniu
                nowoczesnych aplikacji webowych. Specjalizuję się w technologiach frontendowych i
                backendowych, zawsze szukając najlepszych rozwiązań dla moich klientów.
              </p>
              <p className="mb-4">
                Moje portfolio zostało zaktualizowane o najnowsze projekty i umiejętności. Każdy
                dzień to dla mnie okazja do nauki nowych technologii i doskonalenia swojego
                warsztatu programistycznego.
              </p>
              <button className="btn btn-outline-primary">Pobierz CV</button>
            </div>
            <div className="col-lg-6">
              <div className="skills-grid">
                <h4 className="mb-3">Umiejętności:</h4>
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className="skill-item p-3"
                      style={{ border: '1px solid var(--Grey-color)', borderRadius: '8px' }}
                    >
                      <h6 style={{ color: 'var(--Primary-color)' }}>Frontend</h6>
                      <p className="mb-0 small">React, Vue, Angular</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="skill-item p-3"
                      style={{ border: '1px solid var(--Grey-color)', borderRadius: '8px' }}
                    >
                      <h6 style={{ color: 'var(--Primary-color)' }}>Backend</h6>
                      <p className="mb-0 small">Node.js, Python, C++</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="skill-item p-3"
                      style={{ border: '1px solid var(--Grey-color)', borderRadius: '8px' }}
                    >
                      <h6 style={{ color: 'var(--Primary-color)' }}>Database</h6>
                      <p className="mb-0 small">PostgreSQL, MongoDB</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="skill-item p-3"
                      style={{ border: '1px solid var(--Grey-color)', borderRadius: '8px' }}
                    >
                      <h6 style={{ color: 'var(--Primary-color)' }}>Tools</h6>
                      <p className="mb-0 small">Git, Docker, AWS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="w-100">
            <div className="text-center mb-5">
              <h2 className="display-4 mb-3">
                <span className="oneword">/</span>kontakt
              </h2>
              <p className="lead">Skontaktuj się ze mną w sprawie współpracy</p>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="row g-4">
                  <div className="col-md-4 text-center">
                    <div
                      className="contact-item p-4"
                      style={{ border: '2px solid var(--Primary-color)', borderRadius: '12px' }}
                    >
                      <h5 style={{ color: 'var(--Primary-color)' }}>Email</h5>
                      <p>kontakt@portfolio.pl</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div
                      className="contact-item p-4"
                      style={{ border: '2px solid var(--Primary-color)', borderRadius: '12px' }}
                    >
                      <h5 style={{ color: 'var(--Primary-color)' }}>Telefon</h5>
                      <p>+48 123 456 789</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div
                      className="contact-item p-4"
                      style={{ border: '2px solid var(--Primary-color)', borderRadius: '12px' }}
                    >
                      <h5 style={{ color: 'var(--Primary-color)' }}>LinkedIn</h5>
                      <p>linkedin.com/in/portfolio</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary btn-lg px-5"
                    style={{ backgroundColor: 'var(--Primary-color)', border: 'none' }}
                  >
                    Wyślij wiadomość
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewPortfolio;
