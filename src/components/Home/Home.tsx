import { useState, useEffect } from "react";
import "./Home.css";
import { Debate } from "../../functions/types";
import { writeFile } from "@tauri-apps/plugin-fs";
import { dataDir } from "@tauri-apps/api/path";
import { useParams } from "react-router-dom";
import { t } from "i18next";
import DebateGroup from "../../functions/DebateGroup";
import { fetchDebates } from "../../functions/fetchDebates";

const Home = () => {
  const { id: paramId } = useParams();
  const [motions, setMotions] = useState<Debate[]>([]);
  const [selectedMotionId, setSelectedMotionId] = useState<string | undefined>(
    paramId
  );
  const [motionTitle, setMotionTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDebates(setMotions, setLoading, setError);
  }, []);

  /**
   * Deletes a motion by its ID and updates the local storage and state.
   *
   * @param {string} motionId - The ID of the motion to delete.
   * @returns {Promise<void>} - A promise that resolves when the motion is deleted and the data is updated.
   *
   * @throws Will throw an error if there is an issue deleting the motion or updating the file.
   */
  const handleDeleteMotion = async (motionId: string) => {
    try {
      const updatedMotions = motions.filter((motion) => motion.id !== motionId);
      setMotions(updatedMotions);

      const appDirectory = await dataDir();
      const filePath = `${appDirectory}\\debate\\db.json`;
      const updatedData = JSON.stringify(updatedMotions);
      const uint8ArrayData = new TextEncoder().encode(updatedData);

      await writeFile(filePath, uint8ArrayData, { create: true });
      setSelectedMotionId(undefined);
      setMotionTitle("");
    } catch (error) {
      console.error("Error deleting motion:", error);
    }
  };

  const selectedMotion = motions.find(
    (motion) => motion.id === selectedMotionId
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{motionTitle || t("Home.select_motion")}</h1>
      <select
        onChange={(e) => {
          const selectedMotionId = e.target.value;
          const selectedOptionText =
            e.target.options[e.target.selectedIndex].text;
          setSelectedMotionId(selectedMotionId);
          setMotionTitle(selectedOptionText);
        }}
        value={selectedMotionId || ""}
      >
        <option value="" disabled>
          {t("Home.select_motion")}
        </option>
        {motions.map((motion) => (
          <option key={motion.id} value={motion.id}>
            {motion.motion}
          </option>
        ))}
      </select>

      {selectedMotionId && (
        <div>
          <button onClick={() => handleDeleteMotion(selectedMotionId)}>
            {t("Home.delete_motion")}
          </button>
        </div>
      )}

      {selectedMotion && (
        <div className="container">
          <div className="column">
            <DebateGroup
              title={t("Home.OG")}
              speakers={[
                {
                  title: t("Home.PM") + ` - ${selectedMotion.PM?.speaker}`,
                  speech: selectedMotion.PM?.speech,
                  POI: selectedMotion.PM?.POI,
                },
                {
                  title: t("Home.DPM") + ` - ${selectedMotion.DPM?.speaker}`,
                  speech: selectedMotion.DPM?.speech,
                  POI: selectedMotion.DPM?.POI,
                  rebuttal: selectedMotion.DPM?.rebuttal,
                },
              ]}
            />
            <DebateGroup
              title={t("Home.CG")}
              speakers={[
                {
                  title: t("Home.MG") + ` - ${selectedMotion.MG?.speaker}`,
                  speech: selectedMotion.MG?.speech,
                  POI: selectedMotion.MG?.POI,
                  rebuttal: selectedMotion.MG?.rebuttal,
                },
                {
                  title: t("Home.GW") + ` - ${selectedMotion.GW?.speaker}`,
                  speech: selectedMotion.GW?.speech,
                  POI: selectedMotion.GW?.POI,
                  rebuttal: selectedMotion.GW?.rebuttal,
                },
              ]}
            />
          </div>

          <div className="column">
            <DebateGroup
              title={t("Home.OO")}
              speakers={[
                {
                  title: t("Home.LO") + ` - ${selectedMotion.LO?.speaker}`,
                  speech: selectedMotion.LO?.speech,
                  POI: selectedMotion.LO?.POI,
                  rebuttal: selectedMotion.LO?.rebuttal,
                },
                {
                  title: t("Home.DLO") + ` - ${selectedMotion.DLO?.speaker}`,
                  speech: selectedMotion.DLO?.speech,
                  POI: selectedMotion.DLO?.POI,
                  rebuttal: selectedMotion.DLO?.rebuttal,
                },
              ]}
            />
            <DebateGroup
              title={t("Home.CO")}
              speakers={[
                {
                  title: t("Home.MO") + ` - ${selectedMotion.MO?.speaker}`,
                  speech: selectedMotion.MO?.speech,
                  POI: selectedMotion.MO?.POI,
                  rebuttal: selectedMotion.MO?.rebuttal,
                },
                {
                  title: t("Home.OW") + ` - ${selectedMotion.OW?.speaker}`,
                  speech: selectedMotion.OW?.speech,
                  POI: selectedMotion.OW?.POI,
                  rebuttal: selectedMotion.OW?.rebuttal,
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
