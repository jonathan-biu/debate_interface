import React from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { useSettingsContext } from "../../contexts/SettingsContext";
import "./Settings.css";

interface SettingsProps {
  onClose: () => void;
  onLanguageChange: (lang: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onLanguageChange }) => {
  const { t } = useTranslation();
  const { settings, isLoading, updateSetting, resetSettings } =
    useSettingsContext();

  const handleLanguageChange = async (lang: string) => {
    await updateSetting("language", lang);
    onLanguageChange(lang);
  };

  const handleThemeChange = async (theme: string) => {
    await updateSetting("theme", theme);
    applyTheme(theme);
  };

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleTimerChange = async (timer: number) => {
    await updateSetting("speechTimerDefault", timer);
  };

  const handleSoundToggle = async (enabled: boolean) => {
    await updateSetting("enableSoundNotifications", enabled);
  };

  const handleAutoSaveToggle = async (enabled: boolean) => {
    await updateSetting("autoSave", enabled);
  };

  const handleAlwaysOnTopToggle = async (enabled: boolean) => {
    await updateSetting("windowAlwaysOnTop", enabled);
    try {
      await invoke("set_always_on_top", { alwaysOnTop: enabled });
    } catch (error) {
      console.error("Failed to set always on top:", error);
    }
  };

  const handleFontSizeChange = async (fontSize: string) => {
    await updateSetting("fontSize", fontSize);
    applyFontSize(fontSize);
  };

  const applyFontSize = (fontSize: string) => {
    document.documentElement.setAttribute("data-font-size", fontSize);
  };

  const handleResetSettings = async () => {
    await resetSettings();
    applyTheme("light");
    applyFontSize("medium");
    onLanguageChange("en");
  };

  const handleRebuttalToggle = async (enabled: boolean) => {
    await updateSetting("includeRebuttal", enabled);
  };

  const handlePOIToggle = async (enabled: boolean) => {
    await updateSetting("includePOI", enabled);
  };

  if (isLoading) {
    return (
      <div className="settings-overlay">
        <div className="settings-modal">
          <div className="settings-loading">{t("Settings.Loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>{t("Settings.Title")}</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>{t("Settings.Language")}</h3>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="settings-select"
            >
              <option value="en">English</option>
              <option value="he">עברית</option>
            </select>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.Theme")}</h3>
            <select
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="settings-select"
            >
              <option value="light">{t("Settings.Light")}</option>
              <option value="dark">{t("Settings.Dark")}</option>
              <option value="auto">{t("Settings.Auto")}</option>
            </select>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.DefaultSpeechTimer")}</h3>
            <select
              value={settings.speechTimerDefault}
              onChange={(e) => handleTimerChange(parseInt(e.target.value))}
              className="settings-select"
            >
              <option value={5}>5 {t("Settings.Minutes")}</option>
              <option value={6}>6 {t("Settings.Minutes")}</option>
              <option value={7}>7 {t("Settings.Minutes")}</option>
              <option value={8}>8 {t("Settings.Minutes")}</option>
              <option value={10}>10 {t("Settings.Minutes")}</option>
            </select>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.FontSize")}</h3>
            <select
              value={settings.fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="settings-select"
            >
              <option value="small">{t("Settings.Small")}</option>
              <option value="medium">{t("Settings.Medium")}</option>
              <option value="large">{t("Settings.Large")}</option>
              <option value="extra-large">{t("Settings.ExtraLarge")}</option>
            </select>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.Notifications")}</h3>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.enableSoundNotifications}
                onChange={(e) => handleSoundToggle(e.target.checked)}
              />
              <span>{t("Settings.EnableSoundNotifications")}</span>
            </label>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.AutoSave")}</h3>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleAutoSaveToggle(e.target.checked)}
              />
              <span>{t("Settings.EnableAutoSave")}</span>
            </label>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.WindowBehavior")}</h3>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.windowAlwaysOnTop}
                onChange={(e) => handleAlwaysOnTopToggle(e.target.checked)}
              />
              <span>{t("Settings.AlwaysOnTop")}</span>
            </label>
          </div>

          <div className="settings-section">
            <h3>{t("Settings.SpeechOptions")}</h3>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includeRebuttal}
                onChange={(e) => handleRebuttalToggle(e.target.checked)}
              />
              <span>{t("Settings.IncludeRebuttal")}</span>
            </label>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.includePOI}
                onChange={(e) => handlePOIToggle(e.target.checked)}
              />
              <span>{t("Settings.IncludePOI")}</span>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-reset" onClick={handleResetSettings}>
            {t("Settings.Reset")}
          </button>
          <button className="settings-save" onClick={onClose}>
            {t("Settings.Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
