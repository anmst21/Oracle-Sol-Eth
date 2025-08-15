import { HeaderCross } from "../icons";
import Navigation from "./navigation";
import Wallet from "./wallet";
import HeaderLogo from "./header-logo";

const Header = () => {
  return (
    <div className="header">
      <div className="header__cross">
        <HeaderCross />
      </div>
      <div className="header__side-divider" />

      <HeaderLogo />
      <div className="divider">
        <div />
      </div>
      <Navigation />
      <div className="divider-long" />
      {/* <Theme />
      <div className="divider">
        <div />
      </div> */}
      <Wallet />
      <div className="header__side-divider" />
      <div className="header__cross">
        <HeaderCross />
      </div>
    </div>
  );
};

export default Header;
