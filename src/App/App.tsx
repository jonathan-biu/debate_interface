// app css
import "./App.css";
// components
import Home from "../components/Home/Home";
import Navbar from "../components/Navbar/Navbar";
import Speech from "../components/Speech/Speech";
import CreateNew from "../components/CreateNew/CreateNew";
//route
import { Route, Routes } from "react-router-dom";
import "../i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Change language and update document direction
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLang(lang); // Update state and trigger rerender
    });
  };

  // Effect to update document direction based on the selected language
  useEffect(() => {
    document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
  }, [currentLang]);

  useEffect(() => {
    // Set the direction attribute on the root HTML element
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language === "he" ? "he" : "eng";
  }, [i18n.language]); // Run when the language changes
  return (
    <>
      <Navbar />
      <div className="main-content"></div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("he")}>עברית</button>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/Home/:id" Component={Home} />
        <Route path="/CreateNew" Component={CreateNew} />
        <Route path="/Speech/:speaker/:id" Component={Speech} />
      </Routes>
    </>
  );
}

export default App;
