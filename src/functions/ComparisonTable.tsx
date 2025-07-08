import React from "react";
import { t } from "i18next";
import { Debate, SpeakerRole } from "./types";
import { formatText } from "./formatText";

interface ComparisonTableProps {
  debate: Debate;
  includeRebuttal: boolean;
  includePOI: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  debate,
  includeRebuttal,
  includePOI,
}) => {
  const speakers: SpeakerRole[] = [
    "PM",
    "LO",
    "DPM",
    "DLO",
    "MG",
    "MO",
    "GW",
    "OW",
  ];

  const getSpeakerData = (speaker: SpeakerRole) => {
    const data = debate[speaker];
    return {
      name: data?.speaker || "",
      speech: data?.speech || "",
      rebuttal: data?.rebuttal || "",
      POI: data?.POI || "",
    };
  };

  const getSpeakerTeam = (speaker: SpeakerRole) => {
    if (["PM", "DPM", "MG", "GW"].includes(speaker)) return "Government";
    return "Opposition";
  };

  const getSpeakerPosition = (speaker: SpeakerRole) => {
    switch (speaker) {
      case "PM":
      case "LO":
        return "Opening";
      case "DPM":
      case "DLO":
        return "Opening";
      case "MG":
      case "MO":
        return "Closing";
      case "GW":
      case "OW":
        return "Closing";
      default:
        return "";
    }
  };

  return (
    <div className="comparison-table-container">
      <h2 className="comparison-title">{t("Home.ComparisonTable")}</h2>
      <div className="table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>{t("Home.Speaker")}</th>
              <th>{t("Home.Team")}</th>
              <th>{t("Home.Position")}</th>
              <th>{t("Home.Arguments")}</th>
              {includeRebuttal && <th>{t("Home.Rebuttal")}</th>}
              {includePOI && <th>{t("Home.POI")}</th>}
            </tr>
          </thead>
          <tbody>
            {speakers.map((speaker) => {
              const speakerData = getSpeakerData(speaker);
              //   if (!speakerData.name) return null;

              return (
                <tr
                  key={speaker}
                  className={getSpeakerTeam(speaker).toLowerCase()}
                >
                  <td className="speaker-cell">
                    <div className="speaker-title">{t(`Home.${speaker}`)}</div>
                    <div className="speaker-name">{speakerData.name}</div>
                  </td>
                  <td
                    className={`team-cell ${getSpeakerTeam(
                      speaker
                    ).toLowerCase()}`}
                  >
                    {t(`Home.${getSpeakerTeam(speaker)}`)}
                  </td>
                  <td className="position-cell">
                    {getSpeakerPosition(speaker)}
                  </td>
                  <td className="content-cell">
                    <div className="content-text">
                      {formatText(speakerData.speech)}
                    </div>
                  </td>
                  {includeRebuttal && (
                    <td key={`rebuttal-${speaker}`} className="content-cell">
                      <div className="content-text">
                        {speaker !== "PM"
                          ? formatText(speakerData.rebuttal)
                          : "—"}
                      </div>
                    </td>
                  )}
                  {includePOI && (
                    <td key={`poi-${speaker}`} className="content-cell">
                      <div className="content-text">
                        {formatText(speakerData.POI)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
