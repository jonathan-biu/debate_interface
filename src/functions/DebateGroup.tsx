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
  includeRebuttal?: boolean;
  includePOI?: boolean;
}

const DebateGroup: React.FC<DebateGroupProps> = ({
  title,
  speakers,
  includeRebuttal = true,
  includePOI = true,
}) => (
  <div className="group">
    <h2>{title}</h2>
    {speakers.map((speaker, index) => {
      const speakerKey = `speaker-${index}`;
      const speakerTitle = speaker.title || t("Home.NoSpeaker");

      return (
        <div key={speakerKey}>
          <h2>{speakerTitle}</h2>
          <h3>{t("Home.speech", { title: speakerTitle })}</h3>
          <p>{formatText(speaker.speech) || t("Home.no_speech_available")}</p>
          {speaker.rebuttal && includeRebuttal && (
            <div key={`${speakerKey}-rebuttal`}>
              <h3>{t("Home.rebuttal", { title: speakerTitle })}</h3>
              <p>{formatText(speaker.rebuttal)}</p>
            </div>
          )}
          {includePOI && (
            <div key={`${speakerKey}-poi`}>
              <h3>{t("Home.POI", { title: speakerTitle })}</h3>
              <p>{formatText(speaker.POI) || t("Home.no_speech_available")}</p>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default DebateGroup;
