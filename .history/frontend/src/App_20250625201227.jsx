import React, { useState, useEffect } from 'react';

export default function App() {
  const [result, setResult] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [orderPath, setOrderPath] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [resultsCount, setResultsCount] = useState('3');
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingInterval, setLoadingInterval] = useState(null);

  useEffect(() => {
    checkBackend();
  }, []);


  const checkBackend = (timeout = 15000, interval = 1000) => {
  const checker = setInterval(() => {
      fetch('http://localhost:8000/api/ping')
        .then(r => r.json())
        .then(d => {
          setResult("API Ready")
        })
        .catch(() => {
          setResult("Error API")
        });
    }, );
  };

  const sendToPython = () => {
    animateLoading();
    fetch(`http://localhost:8000/api/submit_number?name=${encodeURIComponent(inputValue)}`)
      .then(r => r.json())
      .catch();
  };

  const saveSettings = () => {
    animateLoading();
    fetch(`http://localhost:8000/api/orders?name=${encodeURIComponent(orderPath)}`)
      .then(r => r.json())
      .then(d => {
        setOrderPath(d.path);
        stopLoading(d.message);
      })
      .catch(err => stopLoading(err?.detail || ''));

    fetch(`http://localhost:8000/api/calculation?name=${encodeURIComponent(folderPath)}`)
      .then(r => r.json())
      .then(d => {
        setFolderPath(d.path);
      })
      .catch(err => stopLoading(err?.detail || ''));

    fetch(`http://localhost:8000/api/number_elem?name=${encodeURIComponent(resultsCount)}`)
      .then(r => r.json())
      .then(d => stopLoading(d.message))
      .catch(err => stopLoading(err?.detail || ''));
  };

  const runOptionA = () => {
    animateLoading();
    fetch('http://localhost:8000/api/openExcel1')
      .then(r => r.json())
      .then(d => stopLoading(d.message))
      .catch(err => stopLoading(err?.detail || 'Excel Kalkulacja otwieram ...'));
  };

  const runOptionB = () => {
    animateLoading();
    fetch('http://localhost:8000/api/openExcel2')
      .then(r => r.json())
      .then(d => stopLoading(d.message))
      .catch(err => stopLoading(err?.detail || 'Excel Zam\u00f3wienia otwieram ...'));
  };

  const newExcel = () => {
    animateLoading();
    fetch('http://localhost:8000/api/new_Excel')
      .then(r => r.json())
      .then(d => set)
      .catch(err => stopLoading(err?.detail || ''));
  };

  const sendToPython_Orders = () => {
    animateLoading();
    fetch('http://localhost:8000/api/Orders_dialog')
      .then(r => r.json())
      .then(d => {
        setOrderPath(d.path);
      })
      .catch(err => stopLoading(err?.detail || ''));
  };

  const chooseFilePathCalculation = () => {
    animateLoading();
    fetch('http://localhost:8000/api/Folder_dialog')
      .then(r => r.json())
      .then(d => {
        setFolderPath(d.path);
      })
      .catch(err => stopLoading(err?.detail || ''));
  };

  return (
    <>
      <div id="top-bar">
        <button id="menu-toggle" className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <span className="app-title">AutoWycena</span>
      </div>
      <div id="sidebar" className={sidebarOpen ? 'open' : ''}>
        <ul>
          <li onClick={() => { setActiveSection('home'); setSidebarOpen(false); }}>🏠 Strona Home</li>
          <li onClick={() => { setActiveSection('settings'); setSidebarOpen(false); }}>⚙️ Ustawienia</li>
          <li onClick={() => { setActiveSection('help'); setSidebarOpen(false); }}>❓ Pomoc</li>
        </ul>
      </div>
      <div className="main-wrapper">
        <div className="container" style={{ display: activeSection === 'home' ? 'block' : 'none' }}>
          <h1>Przygotuj wycenę</h1>
          <div className="form-group">
            <input type="text" placeholder="Wprowadź dane" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            <button onClick={sendToPython} className="primary-btn">Dodaj</button>
          </div>
          <p className="result-text">{result}</p>
          <div className="actions">
            <button onClick={runOptionA} className="secondary-btn">Otwórz Excel Kalkulacje</button>
            <button onClick={runOptionB} className="secondary-btn">Otwórz Excel Zamówienia</button>
          </div>
        </div>

        <div className="container" style={{ display: activeSection === 'settings' ? 'block' : 'none' }}>
          <h1>Ustawienia</h1>
          <div className="settings-group">
            <button onClick={newExcel} className="primary-btn">Załaduj nowy arkusz</button>
          </div>
          <div className="settings-group">
            <label htmlFor="orderPath">Ścieżka do Excel – Zamówienia</label>
            <div className="input-row">
              <input type="text" id="orderPath" value={orderPath} onChange={e => setOrderPath(e.target.value)} placeholder="Wklej ścieżke..." />
              <button onClick={sendToPython_Orders} className="icon-button">📁</button>
            </div>
          </div>
          <div className="settings-group">
            <label htmlFor="folderPath">Ścieżka do Folderu</label>
            <div className="input-row">
              <input
                type="text"
                id="folderPath"
                value={folderPath}
                placeholder="Wklej ścieżkę..."
                onChange={e => setFolderPath(e.target.value)}
              />
              <button onClick={chooseFilePathCalculation} className="icon-button">📁</button>

            </div>
          </div>
          <div className="settings-group">
            <label htmlFor="resultsCount">Ile wyników wyświetlić:</label>
            <select id="resultsCount" value={resultsCount} onChange={e => setResultsCount(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="settings-group" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={saveSettings} className="primary-btn" style={{ maxWidth: '200px' }}>Zapisz</button>
          </div>
        </div>

        <div className="container" style={{ display: activeSection === 'help' ? 'block' : 'none' }}>
          <h1>Pomoc</h1>
          <p>🚨 W razie powa\u017cnego problemu... zr\u00f3b sobie kaw\u0119 i spr\u00f3buj ponownie za 5 minut.</p>
        </div>
      </div>
    </>
  );
}
