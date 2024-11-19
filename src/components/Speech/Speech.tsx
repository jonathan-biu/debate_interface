import "./Speech.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Debate, SpeakerRole } from "../../functions/types"; // Adjust the import path
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"; // Import Tauri FS API
import { dataDir } from "@tauri-apps/api/path";

const Speech = () => {
  const { speaker: speakerParam, id } = useParams<{
    speaker: SpeakerRole;
    id: string;
  }>();
  const navigate = useNavigate();
  const speaker = speakerParam as SpeakerRole; // Cast to SpeakerRole

  const [speech, setSpeech] = useState<string>("");
  const [rebuttal, setRebuttal] = useState<string>("");
  const [POI, setPOI] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Translation dictionary for speaker roles
  const speakerTranslations: Record<SpeakerRole, string> = {
    PM: "ראש הממשלה",
    LO: 'יו"ר אופוזיציה',
    DPM: "סגן ראש הממשלה",
    DLO: 'סגן יו"ר האופוזיציה',
    MG: "מרחיב הממשלה",
    MO: "מרחיב האופוזיציה",
    GW: "מסכם הממשלה",
    OW: "מסכם האופוזיציה",
  };

  useEffect(() => {
    const fetchDebate = async () => {
      if (!id) {
        setError("Debate ID is not available.");
        return;
      }
      try {
        const appDirectory = await dataDir();
        const filePath = `${appDirectory}\\debate\\db.json`;

        // Read the existing debates from the file
        let currentDebates: Debate[] = [];
        try {
          const data = await readTextFile(filePath);
          currentDebates = JSON.parse(data);
        } catch (err) {
          console.log("No existing data, starting with an empty array.");
        }

        // Find the debate by ID
        const debate = currentDebates.find((debate) => debate.id === id);

        if (debate) {
          setSpeech(debate[speaker]?.speech || "");
          setRebuttal(debate[speaker]?.rebuttal || "");
          setPOI(debate[speaker]?.POI || "");
        } else {
          setError("Debate not found.");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDebate();
    } else {
      setError("ID is not available.");
      setLoading(false);
    }
  }, [speaker, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      return; // Handle the case where id is not available
    }

    try {
      const appDirectory = await dataDir();
      const filePath = `${appDirectory}\\debate\\db.json`;

      // Read the existing debates from the file
      let currentDebates: Debate[] = [];
      try {
        const data = await readTextFile(filePath);
        currentDebates = JSON.parse(data);
      } catch (err) {
        console.log("No existing data, starting with an empty array.");
      }

      // Find the debate by ID
      const existingDebate = currentDebates.find((debate) => debate.id === id);
      if (!existingDebate) {
        setError("Debate not found.");
        return;
      }

      // Create the updated debate object
      const updatedDebate: Debate = {
        motion: existingDebate.motion,
        PM: {
          ...existingDebate.PM,
          ...(speaker === "PM" ? { speech, rebuttal, POI } : {}),
        },
        LO: {
          ...existingDebate.LO,
          ...(speaker === "LO" ? { speech, rebuttal, POI } : {}),
        },
        DPM: {
          ...existingDebate.DPM,
          ...(speaker === "DPM" ? { speech, rebuttal, POI } : {}),
        },
        DLO: {
          ...existingDebate.DLO,
          ...(speaker === "DLO" ? { speech, rebuttal, POI } : {}),
        },
        MG: {
          ...existingDebate.MG,
          ...(speaker === "MG" ? { speech, rebuttal, POI } : {}),
        },
        MO: {
          ...existingDebate.MO,
          ...(speaker === "MO" ? { speech, rebuttal, POI } : {}),
        },
        GW: {
          ...existingDebate.GW,
          ...(speaker === "GW" ? { speech, rebuttal, POI } : {}),
        },
        OW: {
          ...existingDebate.OW,
          ...(speaker === "OW" ? { speech, rebuttal, POI } : {}),
        },
        id: id,
      };

      // Update the debate in the file
      currentDebates = currentDebates.map((debate) =>
        debate.id === id ? updatedDebate : debate
      );
      await writeTextFile(filePath, JSON.stringify(currentDebates));

      // Navigate after successful update
      if (speaker === "OW") {
        navigate(`/Home/${id}`);
      } else {
        navigateToNextSpeaker(speaker, id);
      }
    } catch (error) {
      console.error("Error updating debate entry:", error);
      setError("Error updating debate entry.");
    }
  };

  const navigateToNextSpeaker = (currentSpeaker: SpeakerRole, id: string) => {
    const speakersOrder: SpeakerRole[] = [
      "PM",
      "LO",
      "DPM",
      "DLO",
      "MG",
      "MO",
      "GW",
      "OW",
    ];
    const currentIndex = speakersOrder.indexOf(currentSpeaker);
    const nextIndex = (currentIndex + 1) % speakersOrder.length;
    const nextSpeaker = speakersOrder[nextIndex];

    navigate(`/Speech/${nextSpeaker}/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>נאום {speakerTranslations[speaker]}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>טיעונים:</label>
          <textarea
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
            rows={6}
          />
        </div>
        {!(speaker === "PM") && (
          <div>
            <label>ריבטל:</label>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              rows={6}
            />
          </div>
        )}
        <div>
          <label>POI:</label>
          <textarea
            value={POI}
            onChange={(e) => setPOI(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default Speech;
