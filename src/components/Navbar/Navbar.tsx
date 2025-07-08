import "./Navbar.css";
import { Link } from "react-router-dom";
import { t } from "i18next";

type NavbarProps = {
  inSpeech?: boolean;
  id?: string;
  onSettingsClick?: () => void;
};

function Navbar({ inSpeech, id, onSettingsClick }: NavbarProps) {
  const Navlist = [
    { title: "NavBar.Home", link: "" },
    { title: "NavBar.new_motion", link: "/CreateNew" },
  ];

  const speakers = [
    { title: "NavBar.PM", link: `/Speech/PM/${id}` },
    { title: "NavBar.LO", link: `/Speech/LO/${id}` },
    { title: "NavBar.DPM", link: `/Speech/DPM/${id}` },
    { title: "NavBar.DLO", link: `/Speech/DLO/${id}` },
    { title: "NavBar.MG", link: `/Speech/MG/${id}` },
    { title: "NavBar.MO", link: `/Speech/MO/${id}` },
    { title: "NavBar.GW", link: `/Speech/GW/${id}` },
    { title: "NavBar.OW", link: `/Speech/OW/${id}` },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <ul className="nav-links">
          {inSpeech
            ? speakers.map((item, index) => (
                <li key={index}>
                  <Link to={item.link}>{t(item.title)}</Link>
                </li>
              ))
            : Navlist.map((item, index) => (
                <li key={index}>
                  <Link to={item.link}>{t(item.title)}</Link>
                </li>
              ))}
        </ul>
      </div>
      <div className="navbar-right">
        <button
          className="settings-button"
          onClick={onSettingsClick}
          title={t("Settings.Title")}
        >
          ⚙️
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
