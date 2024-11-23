import "./Navbar.css";
import { Link } from "react-router-dom";
import { t } from "i18next";

function Navbar() {
  const Navlist = [
    { title: t("NavBar.Home"), link: "" },
    { title: t("NavBar.new_motion"), link: "/CreateNew" },
  ];
  return (
    <>
      <nav className="navbar">
        <div className="navbar-center">
          <ul className="nav-links">
            {Navlist.map((item, index) => (
              <li key={index}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
