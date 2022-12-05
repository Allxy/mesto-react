import { memo } from "react";

function Header() {
  return (
    <header className="header">
      <div className="header__logo"></div>
    </header>
  );
}

export default memo(Header);
