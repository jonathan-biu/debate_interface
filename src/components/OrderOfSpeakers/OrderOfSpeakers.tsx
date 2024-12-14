import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { dataDir } from "@tauri-apps/api/path";
import "./OrderOfSpeakers.css";

const OrderOfSpeakers = () => {
  const { id } = useParams<{ id: string }>();
  const [speakers, setSpeakers] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    const newSpeakers = [...speakers];
    newSpeakers[index] = value;
    setSpeakers(newSpeakers);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const appDirectory = await dataDir();
      const filePath = `${appDirectory}\\debate\\db.json`;

      // Read the existing data
      const existingData = await readTextFile(filePath);
      const db = existingData ? JSON.parse(existingData) : {};

      // Mapping of speaker roles to their respective keys
      const speakerKeys = ["PM", "DPM", "LO", "DLO", "MG", "GW", "MO", "OW"];
      const currentJson = db.find((debate: { id: string }) => debate.id === id);
      // Update the data with the new speakers
      if (id && !currentJson.id) {
        console.log(currentJson.id);

        db.id = {};
      }
      speakers.forEach((speaker, index) => {
        if (id) {
          // console.log(
          //   currentJson[speakerKeys[index]],
          //   id,
          //   speakerKeys[index],
          //   speaker
          // );

          currentJson[speakerKeys[index]].speaker = speaker;
        }
      });

      // Write the updated data back to the file
      await writeTextFile(filePath, JSON.stringify(db, null, 2));

      navigate(`/speech/PM/${id}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const speakerLabels = [
    t("Home.PM"),
    t("Home.DPM"),
    t("Home.LO"),
    t("Home.DLO"),
    t("Home.MG"),
    t("Home.GW"),
    t("Home.MO"),
    t("Home.OW"),
  ];

  return (
    <div>
      <h1>{t("Speakers.OrderOfSpeakers")}</h1>
      <form onSubmit={handleSubmit}>
        {speakers.map((speaker, index) => (
          <div key={index} className="inputdiv">
            <label>{speakerLabels[index]}</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">{t("Speech.submit")}</button>
      </form>
    </div>
  );
};

export default OrderOfSpeakers;
