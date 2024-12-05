import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { dataDir } from "@tauri-apps/api/path";

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
      const speakerKeys = ["PM", "LO", "DPM", "DLO", "MG", "MO", "GW", "OW"];
      const currentJson = db.find((debate: { id: string }) => debate.id === id);
      // Update the data with the new speakers
      if (id && !currentJson.id) {
        console.log(currentJson.id);

        db.id = {};
      }
      speakers.forEach((speaker, index) => {
        if (id) {
          console.log(
            currentJson[speakerKeys[index]],
            id,
            speakerKeys[index],
            speaker
          );

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
    t("Home.LO"),
    t("Home.DPM"),
    t("Home.DLO"),
    t("Home.MG"),
    t("Home.MO"),
    t("Home.GW"),
    t("Home.OW"),
  ];

  return (
    <div>
      <h1>Order of Speakers</h1>
      <form onSubmit={handleSubmit}>
        {speakers.map((speaker, index) => (
          <div key={index}>
            <label>{speakerLabels[index]}</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
};

export default OrderOfSpeakers;
