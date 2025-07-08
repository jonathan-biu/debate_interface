import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface AppSettings {
  language: string;
  theme: string;
  speechTimerDefault: number;
  enableSoundNotifications: boolean;
  autoSave: boolean;
  windowAlwaysOnTop: boolean;
  fontSize: string;
  includeRebuttal: boolean;
  includePOI: boolean;
}

export const defaultSettings: AppSettings = {
  language: "en",
  theme: "light",
  speechTimerDefault: 7,
  enableSoundNotifications: true,
  autoSave: true,
  windowAlwaysOnTop: false,
  fontSize: "medium",
  includeRebuttal: true,
  includePOI: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const savedSettings = await invoke<string>("get_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.log("No saved settings found, using defaults");
    }
    setIsLoading(false);
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await invoke("save_settings", { settings: JSON.stringify(newSettings) });
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    return await saveSettings(newSettings);
  };

  const resetSettings = async () => {
    return await saveSettings(defaultSettings);
  };

  const getSetting = <K extends keyof AppSettings>(key: K): AppSettings[K] => {
    return settings[key];
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    saveSettings,
    updateSetting,
    resetSettings,
    getSetting,
    loadSettings,
  };
};

export default useSettings;
