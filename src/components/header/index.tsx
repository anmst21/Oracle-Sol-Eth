import { HeaderCross } from "../icons";
import Theme from "./theme";
import Navigation from "./navigation";
import Wallet from "./wallet";

const Header = () => {
  return (
    <div className="header">
      <div className="header__cross">
        <HeaderCross />
      </div>
      <div className="header__side-divider" />
      <div className="header__logo" />
      <div className="divider">
        <div />
      </div>
      <Navigation />
      <div className="divider-long" />
      <Theme />
      <div className="divider">
        <div />
      </div>
      <Wallet />
      <div className="header__side-divider" />
      <div className="header__cross">
        <HeaderCross />
      </div>
    </div>
  );
};

export default Header;
