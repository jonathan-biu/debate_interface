import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Debate } from "../../functions/types"; // Ensure types are imported correctly
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs"; // Import Tauri FS API
import { dataDir } from "@tauri-apps/api/path";
import { t } from "i18next";

function CreateNew() {
  const [motion, setMotion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSetMotion = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMotion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDebate: Omit<Debate, "id"> = {
      motion: motion,
      PM: { speaker: "", speech: "", rebuttal: "", POI: "" },
      LO: { speaker: "", speech: "", rebuttal: "", POI: "" },
      DPM: { speaker: "", speech: "", rebuttal: "", POI: "" },
      DLO: { speaker: "", speech: "", rebuttal: "", POI: "" },
      MG: { speaker: "", speech: "", rebuttal: "", POI: "" },
      MO: { speaker: "", speech: "", rebuttal: "", POI: "" },
      GW: { speaker: "", speech: "", rebuttal: "", POI: "" },
      OW: { speaker: "", speech: "", rebuttal: "", POI: "" },
    };

    try {
      // Read the existing debates from the file
      const appDirectory = await dataDir();
      const filePath = `${appDirectory}\\debate\\db.json`;
      let currentDebates: Debate[] = [];

      try {
        const data = await readTextFile(filePath);
        currentDebates = JSON.parse(data);
      } catch (err) {
        console.log("No existing data, starting with an empty array.");
      }

      // Create a new debate object with a generated ID
      const newDebateWithId = { ...newDebate, id: `${Date.now()}` };

      // Save the updated debates to the file
      currentDebates.push(newDebateWithId);
      await writeTextFile(filePath, JSON.stringify(currentDebates));

      // Update the state and UI
      setSuccess(true);
      setMotion(""); // Clear input on success
      navigate(`/speakers/${newDebateWithId.id}`); // Navigate to the new route
    } catch (error) {
      setError("An error occurred while creating the debate entry.");
      console.error(error);
    }
  };

  return (
    <>
      <h1>{t("CreateNew.motion")}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={motion}
          onChange={handleSetMotion}
          placeholder={t("CreateNew.insert_motion")}
        />
        <button type="submit">{t("CreateNew.start_debate")}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Debate created successfully!</p>
      )}
    </>
  );
}

export default CreateNew;
