import React, { createContext, useContext, ReactNode } from "react";
import { useSettings, AppSettings } from "../functions/useSettings";

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K];
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const settingsHook = useSettings();

  return (
    <SettingsContext.Provider value={settingsHook}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
