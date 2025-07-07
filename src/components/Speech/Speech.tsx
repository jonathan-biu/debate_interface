import "./Speech.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Debate, SpeakerRole } from "../../functions/types"; // Adjust the import path
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"; // Import Tauri FS API
import { dataDir } from "@tauri-apps/api/path";
import { t } from "i18next";
import Timer from "../Timer/Timer"; // Adjust the import path

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
  const [motion, setMotion] = useState<string>("");
  const [speakerName, setSpeakerName] = useState<string>(""); // Add speakerTitle state
  const speechRef = useRef<HTMLTextAreaElement>(null);
  const rebuttalRef = useRef<HTMLTextAreaElement>(null);
  const poiRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "KeyB") {
        event.preventDefault();
        wrapSelectedText("*");
      } else if (event.ctrlKey && event.code === "KeyD") {
        event.preventDefault();
        wrapSelectedText("$");
      } else if (event.code === "Tab") {
        event.preventDefault();
        insertTab(event);
      } else if (event.ctrlKey && event.code === "ArrowDown") {
        event.preventDefault();
        focusNextTextArea();
      } else if (event.ctrlKey && event.code === "ArrowUp") {
        event.preventDefault();
        focusPreviousTextArea();
      } else if (
        (event.code === "Enter" || event.code === "NumpadEnter") &&
        !event.shiftKey
      ) {
        handleOrderedListAutocomplete(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOrderedListAutocomplete = (event: KeyboardEvent) => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (!textArea || !["speech", "rebuttal", "POI"].includes(textArea.name))
      return;

    const start = textArea.selectionStart;
    const text = textArea.value;
    const before = text.substring(0, start);
    const match = before.match(/(\n|^)(\s*)(\d+|[a-zA-Z])\.\s*.*$/);

    if (match) {
      const indentation = match[2];
      const listType = match[3];
      const after = text.substring(start);
      let nextItem;

      if (/\d+/.test(listType)) {
        nextItem = parseInt(listType, 10) + 1 + ".";
      } else {
        nextItem = String.fromCharCode(listType.charCodeAt(0) + 1) + ".";
      }

      textArea.value = `${before}\n${indentation}${nextItem} ${after}`;
      textArea.selectionStart = textArea.selectionEnd =
        start + `\n${indentation}${nextItem} `.length;
      event.preventDefault();
    } else {
      const listTypeMatch = before.match(/(\n|^)(\s*)(listType)\.\s*$/);
      if (listTypeMatch) {
        const indentation = listTypeMatch[2];
        const after = text.substring(start);
        textArea.value = `${before}\n${indentation}a. ${after}`;
        textArea.selectionStart = textArea.selectionEnd =
          start + `\n${indentation}a. `.length;
        event.preventDefault();
      }
    }
  };

  const insertTab = (event: KeyboardEvent) => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (!textArea || !["speech", "rebuttal", "POI"].includes(textArea.name))
      return;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;
    const before = text.substring(0, start);
    const match = before.match(/(\n|^)(\s*)(\d+|[a-zA-Z])\.\s*.*$/);

    if (match) {
      const indentation = match[2] + "\t";
      const listType = match[3];
      const after = text.substring(start);
      let nextItem;

      if (/\d+/.test(listType)) {
        nextItem = "a.";
      } else {
        nextItem = "1.";
      }

      textArea.value = `${before}\n${indentation}${nextItem} ${after}`;
      textArea.selectionStart = textArea.selectionEnd =
        start + `\n${indentation}${nextItem} `.length;
      event.preventDefault();
    } else {
      textArea.value = `${text.substring(0, start)}\t${text.substring(end)}`;
      textArea.selectionStart = textArea.selectionEnd = start + 1;
    }
  };

  const focusNextTextArea = () => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (textArea === speechRef.current) {
      if (rebuttalRef.current) {
        rebuttalRef.current.focus();
      } else {
        poiRef.current?.focus();
      }
    } else if (textArea === rebuttalRef.current) {
      poiRef.current?.focus();
    } else if (textArea === poiRef.current) {
      return; // No next text area
    }
  };

  const focusPreviousTextArea = () => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (textArea === speechRef.current) {
      return; // No previous text area
    } else if (textArea === rebuttalRef.current) {
      speechRef.current?.focus();
    } else if (textArea === poiRef.current) {
      if (rebuttalRef.current) {
        rebuttalRef.current.focus();
      } else {
        speechRef.current?.focus();
      }
    }
  };
  const wrapSelectedText = (wrapper: string) => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (!textArea || !["speech", "rebuttal", "POI"].includes(textArea.name))
      return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;

    if (start === end) return; // No text selected

    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${wrapper}${selected}${wrapper}${after}`;
    textArea.value = newText;

    // Update the state based on which text area is focused
    if (textArea.name === "speech") {
      setSpeech(newText);
    } else if (textArea.name === "rebuttal") {
      setRebuttal(newText);
    } else if (textArea.name === "POI") {
      setPOI(newText);
    }
  };
  // Translation dictionary for speaker roles

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
          setMotion(debate.motion);
          setSpeakerName(debate[speaker]?.speaker || ""); // Set the speaker title
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

  useEffect(() => {
    const handleback = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1);
      }
    };

    document.addEventListener("keydown", handleback);
    return () => {
      document.removeEventListener("keydown", handleback);
    };
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <h1>{motion}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {t("Speech.speech", {
              title: t(`Home.${speaker}`),
            }) + ` - ${speakerName}`}
          </h2>
          <div>
            <Timer />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t("Speech.arguments")}</label>
            <textarea
              name="speech"
              ref={speechRef}
              value={speech}
              onChange={(e) => setSpeech(e.target.value)}
              rows={6}
            />
          </div>
          {!(speaker === "PM") && (
            <div>
              <label>{t("Speech.rebuttal")}</label>
              <textarea
                name="rebuttal"
                ref={rebuttalRef}
                value={rebuttal}
                onChange={(e) => setRebuttal(e.target.value)}
                rows={6}
              />
            </div>
          )}
          <div>
            <label>{t("Speech.POI")}</label>
            <textarea
              name="POI"
              ref={poiRef}
              value={POI}
              onChange={(e) => setPOI(e.target.value)}
              rows={4}
            />
          </div>
          <button type="submit">{t("Speech.submit")}</button>
        </form>
      </div>
    </>
  );
};

export default Speech;
