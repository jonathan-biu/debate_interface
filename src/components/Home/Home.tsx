import { useState, useEffect } from "react";
import "./Home.css";
import { Debate } from "../../functions/types";
import { readTextFile, exists, mkdir, writeFile } from "@tauri-apps/plugin-fs";
import { dataDir } from "@tauri-apps/api/path";
import { useParams } from "react-router-dom";
// import { useElectronAPI } from "../../hooks/useElectronAPI"; // Adjust the path if needed

const formatText = (text: string) => {
  if (!text) return "Speech not available";

  const parts = text.split(/(\*.*?\*|\$.*?\$|\n)/g);

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
    }

    return part;
  });
};

interface DebateGroupProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  speakers: any[];
}

const DebateGroup: React.FC<DebateGroupProps> = ({ title, speakers }) => (
  <div className="group">
    <h2>{title}</h2>
    {speakers.map((speaker, index) => (
      <div key={index}>
        <h2>{speaker.title}</h2>
        <h3>טיעוני {speaker.title}:</h3>
        <p>{formatText(speaker.speech)}</p>
        {speaker.rebuttal && (
          <>
            <h3>ריבטל {speaker.title}:</h3>
            <p>{formatText(speaker.rebuttal)}</p>
          </>
        )}

        <h3>POI:</h3>
        <p>{formatText(speaker.POI)}</p>
      </div>
    ))}
  </div>
);

const Home = () => {
  const param_id = useParams().id;

  const [motions, setMotions] = useState<Debate[]>([]);
  const [selectedMotionId, setSelectedMotionId] = useState<
    string | null | undefined
  >(param_id);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Using the electronAPI to fetch debates
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const appDirectory = await dataDir();
        const directoryPath = `${appDirectory}\\debate`;
        const folderExists = await exists(directoryPath);
        if (!folderExists) {
          // Create the folder
          const dir = await mkdir(directoryPath, { recursive: true });
          console.log(dir);

          console.log("Folder created:", directoryPath);
        }

        const filePath = `${directoryPath}\\db.json`;

        // Check if the db.json file exists
        const fileExists = await exists(filePath);
        if (!fileExists) {
          // If db.json doesn't exist, create it with an empty array as content
          // JSON data to write
          const data = JSON.stringify([
            {
              motion: "THBT something",
              PM: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              LO: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              DPM: {
                speech:
                  "*Lorem ipsum* dolor $sit amet, consectetur$ adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              DLO: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              MG: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              MO: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              GW: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              OW: {
                speech:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum hendrerit aliquam nulla, nec vulputate eros tristique quis. Etiam ultricies vel urna non tempus. Nulla sit amet tempor ante. Mauris tristique aliquam magna, sit amet rhoncus quam consequat sed. Aliquam a egestas ante. Quisque scelerisque, ex sit amet pretium auctor, orci arcu porttitor lectus, eu pulvinar quam metus in lectus. Praesent luctus dictum lorem vitae scelerisque. Aenean diam velit, commodo ac eros vitae, varius faucibus libero. In tempus consectetur lacus imperdiet gravida. Fusce orci sem, venenatis sed ligula non, aliquam dignissim justo. Nunc interdum justo ante, at tristique risus fringilla id. Aliquam dapibus dolor elit, at aliquam nunc lobortis vel.",
                rebuttal:
                  "Curabitur elementum accumsan arcu id semper. Donec convallis ut arcu eleifend sollicitudin. Phasellus sit amet molestie purus. In id arcu eu arcu rutrum dignissim. Nunc vel luctus elit, id rhoncus est. Fusce porttitor felis id urna suscipit egestas. Nam libero mauris, posuere ac odio eu, laoreet tempor tortor. Donec augue est, egestas vel nisi vitae, feugiat luctus metus.",
                POI: "Quisque eleifend risus ut libero iaculis bibendum vitae et massa. Sed quam purus, finibus a molestie sit amet, aliquam sed arcu. Mauris a venenatis diam. Nulla vel tincidunt eros. Sed volutpat dui ut diam viverra, vel maximus mauris volutpat. Nulla ac accumsan",
              },
              id: "1",
            },
            {
              id: "5b643975-92be-4afc-8113-b43b51fe5b72",
              motion: "asougdiaushpdhasohbdo",
              PM: {
                speech: "piahsodboasbdojbasojbd",
                rebuttal: "",
                POI: "obobadsofboajbjfnaojbnfo",
              },
              LO: {
                speech: "asljbdoiasodnoaisndon",
                rebuttal: "ojnoadnofnapinfljajnp",
                POI: "inpiadnfpinapifnpianpfinapinfp",
              },
              DPM: {
                speech: "test123 *321321* $132132$",
                rebuttal: "test123 *321321* $132132$",
                POI: "test123 *321321* $132132$",
              },
              DLO: {
                speech: "",
                rebuttal: "",
                POI: "",
              },
              MG: {
                speech: "",
                rebuttal: "",
                POI: "",
              },
              MO: {
                speech: "",
                rebuttal: "",
                POI: "",
              },
              GW: {
                speech: "",
                rebuttal: "",
                POI: "",
              },
              OW: {
                speech: "",
                rebuttal: "",
                POI: "",
              },
            },
          ]);

          // Convert the string data into a Uint8Array
          const uint8ArrayData = new TextEncoder().encode(data);
          await writeFile(filePath, uint8ArrayData, {
            create: true,
          });
        }

        const data = await readTextFile(filePath); // Read from the db.json file in appDataDir

        setMotions(JSON.parse(data)); // Parse and set debates data
        setLoading(false);
      } catch (err) {
        setError("Failed to load debates");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDebates();
  }, []);

  const handleDeleteMotion = async (motionId: string) => {
    try {
      // Remove the selected motion from the state
      const updatedMotions = motions.filter((motion) => motion.id !== motionId);
      setMotions(updatedMotions);

      // Update the file after deleting the motion
      const appDirectory = await dataDir();
      const filePath = `${appDirectory}\\debate\\db.json`;
      const updatedData = JSON.stringify(updatedMotions);
      const uint8ArrayData = new TextEncoder().encode(updatedData);

      await writeFile(filePath, uint8ArrayData, { create: true });
    } catch (error) {
      console.error("Error deleting motion:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedMotion = motions.find(
    (motion) => motion.id === selectedMotionId
  );

  return (
    <div>
      <h1>בחר/י מושן</h1>
      <select
        onChange={(e) => setSelectedMotionId(e.target.value)}
        value={selectedMotionId || ""}
      >
        <option value="" disabled>
          בחר/י מושן
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
            מחק/י מושן
          </button>
        </div>
      )}
      {selectedMotion && (
        <div className="container">
          <div className="column">
            <DebateGroup
              title="ממשלה ראשונה"
              speakers={[
                {
                  title: 'רוה"מ',
                  speech: selectedMotion.PM?.speech,
                  POI: selectedMotion.PM?.POI,
                },
                {
                  title: 'סגן רוה"מ',
                  speech: selectedMotion.DPM?.speech,
                  POI: selectedMotion.DPM?.POI,
                  rebuttal: selectedMotion.DPM?.rebuttal,
                },
              ]}
            />
            <DebateGroup
              title="ממשלה שנייה"
              speakers={[
                {
                  title: "מרחיב ממשלה",
                  speech: selectedMotion.MG?.speech,
                  POI: selectedMotion.MG?.POI,
                  rebuttal: selectedMotion.MG?.rebuttal,
                },
                {
                  title: "מסכם ממשלה",
                  speech: selectedMotion.GW?.speech,
                  rebuttal: selectedMotion.GW?.rebuttal,
                  POI: selectedMotion.GW?.POI,
                },
              ]}
            />
          </div>

          <div className="column">
            <DebateGroup
              title="אופוזיציה ראשונה"
              speakers={[
                {
                  title: 'יו"ר האופוזיציה',
                  speech: selectedMotion.LO?.speech,
                  rebuttal: selectedMotion.LO?.rebuttal,
                  POI: selectedMotion.LO?.POI,
                },
                {
                  title: 'סגן יו"ר האופוזיציה',
                  speech: selectedMotion.DLO?.speech,
                  rebuttal: selectedMotion.DLO?.rebuttal,
                  POI: selectedMotion.DLO?.POI,
                },
              ]}
            />
            <DebateGroup
              title="אופוזיציה שנייה"
              speakers={[
                {
                  title: "מרחיב אופוזיציה",
                  speech: selectedMotion.MO?.speech,
                  rebuttal: selectedMotion.MO?.rebuttal,
                  POI: selectedMotion.MO?.POI,
                },
                {
                  title: "מסכם אופוזיציה",
                  speech: selectedMotion.OW?.speech,
                  rebuttal: selectedMotion.OW?.rebuttal,
                  POI: selectedMotion.OW?.POI,
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
