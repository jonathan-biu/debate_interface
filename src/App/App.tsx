import "./App.css";
import Home from "../components/Home/Home";
import Navbar from "../components/Navbar/Navbar";
import Speech from "../components/Speech/Speech";
import CreateNew from "../components/CreateNew/CreateNew";
import OrderOfSpeakers from "../components/OrderOfSpeakers/OrderOfSpeakers";
import Settings from "../components/Settings/Settings";
import { Route, Routes, useLocation } from "react-router-dom";
import "../i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "../contexts/SettingsContext";
function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [showSettings, setShowSettings] = useState(false);
  const { settings } = useSettingsContext();
  const location = useLocation();

  // Check if current route is Speech
  const inSpeech = /^\/Speech\/[^/]+\/[^/]+$/i.test(location.pathname);
  const id = inSpeech ? location.pathname.split("/")[3] : undefined;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLang(lang);
    });
  };

  // Apply settings when they change
  useEffect(() => {
    // Apply theme
    if (settings.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }

    // Apply font size
    if (settings.fontSize) {
      document.documentElement.setAttribute(
        "data-font-size",
        settings.fontSize
      );
    }

    // Apply language
    if (settings.language && settings.language !== i18n.language) {
      changeLanguage(settings.language);
    }
  }, [settings, i18n.language]);

  useEffect(() => {
    document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language === "he" ? "he" : "eng";
  }, [i18n.language]);

  return (
    <>
      <Navbar
        inSpeech={inSpeech}
        id={id}
        onSettingsClick={() => setShowSettings(true)}
      />
      <div className="main-content"></div>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Home/:id" Component={Home} />
        <Route path="/CreateNew" Component={CreateNew} />
        <Route path="/Speech/:speaker/:id" Component={Speech} />
        <Route path="/speakers/:id" Component={OrderOfSpeakers} />
      </Routes>

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onLanguageChange={changeLanguage}
        />
      )}
    </>
  );
}

export default App;
