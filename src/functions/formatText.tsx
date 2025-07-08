import { t } from "i18next";

// import { useElectronAPI } from "../../hooks/useElectronAPI"; // Adjust the path if needed
export const formatText = (text: string) => {
  if (!text) return `${t("Home.no_speech_available")}`;

  const parts = text.split(/(\*.*?\*|\$.*?\$|\n|\t)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    // Handle bold (with *)
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={index} style={{ fontWeight: "bold", color: "red" }}>
          {part.slice(1, -1)}
        </span>
      );
    }

    // Handle blue bold (with $)
    else if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <span key={index} style={{ color: "blue", fontWeight: "bold" }}>
          {part.slice(1, -1)}
        </span>
      );
    }

    // Handle newline characters
    else if (part === "\n") {
      return <br key={index} />;
    } else if (part === "\t") {
      return <span key={index}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
    }

    return part;
  });
};
