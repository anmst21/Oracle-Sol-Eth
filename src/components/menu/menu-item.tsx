import classNames from "classnames";
import { AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  slug: string;
  icon: React.ReactNode;
  modal?: React.ReactNode;
};

const MenuItem = ({ slug, icon, modal }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { push } = useRouter();

  const onClick = () => {
    if (!isMenuOpen && modal) {
      setIsMenuOpen(true);
    }
    if (isMenuOpen && modal) {
      push(slug);
      setIsMenuOpen(false);
    }
    if (!modal) push(slug);
  };

  return (
    <div
      onMouseLeave={() => setIsMenuOpen(false)}
      className={classNames("menu-item", {
        "menu-item--active": pathname === slug,
        "menu-item--open": isMenuOpen,
      })}
    >
      <button onClick={onClick} className="menu-item__btn">
        {icon}
      </button>
      {modal && (
        <AnimatePresence mode="wait">{isMenuOpen && modal}</AnimatePresence>
      )}
    </div>
  );
};

export default MenuItem;
