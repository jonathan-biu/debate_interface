import { readTextFile, exists, mkdir, writeFile } from "@tauri-apps/plugin-fs";
import { dataDir } from "@tauri-apps/api/path";
import { Debate } from "./types";

const createDirectoryIfNeeded = async (directoryPath: string) => {
  const folderExists = await exists(directoryPath);
  if (!folderExists) {
    await mkdir(directoryPath, { recursive: true });
    console.log("Folder created:", directoryPath);
  }
};

const createFileIfNeeded = async (filePath: string) => {
  const fileExists = await exists(filePath);
  if (!fileExists) {
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

    const uint8ArrayData = new TextEncoder().encode(data);
    await writeFile(filePath, uint8ArrayData, { create: true });
  }
};

const fetchMotionData = async (filePath: string): Promise<Debate[]> => {
  const data = await readTextFile(filePath);
  return JSON.parse(data);
};

export const fetchDebates = async (
  setMotions: React.Dispatch<React.SetStateAction<Debate[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    setLoading(true);
    const appDirectory = await dataDir();
    const directoryPath = `${appDirectory}\\debate`;
    const filePath = `${directoryPath}\\db.json`;

    await createDirectoryIfNeeded(directoryPath);
    await createFileIfNeeded(filePath);
    const motions = await fetchMotionData(filePath);

    setMotions(motions);
    setLoading(false);
  } catch (err) {
    setError("Failed to load debates");
    setLoading(false);
    console.error(err);
  }
};
