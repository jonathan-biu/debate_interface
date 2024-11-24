import React from "react";
import { t } from "i18next";
import { formatText } from "./formatText";

interface DebateGroupProps {
  title: string;
  speakers: {
    title: string;
    speech: string;
    rebuttal?: string;
    POI: string;
  }[];
}

const DebateGroup: React.FC<DebateGroupProps> = ({ title, speakers }) => (
  <div className="group">
    <h2>{title}</h2>
    {speakers.map((speaker, index) => (
      <div key={index}>
        <h2>{speaker.title}</h2>
        <h3>{t("Home.speech", { title: speaker.title })}</h3>
        <p>{formatText(speaker.speech)}</p>
        {speaker.rebuttal && (
          <>
            <h3>{t("Home.rebuttal", { title: speaker.title })}</h3>
            <p>{formatText(speaker.rebuttal)}</p>
          </>
        )}
        <h3>{t("Home.POI", { title: speaker.title })}</h3>
        <p>{formatText(speaker.POI)}</p>
      </div>
    ))}
  </div>
);

export default DebateGroup;
