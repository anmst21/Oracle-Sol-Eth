import classNames from "classnames";
import { AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  slug: string;
  icon: React.ReactNode;
  modal?: React.ReactNode;
  active?: boolean;
};

const MenuItem = ({ slug, icon, modal, active }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
        "menu-item--active": active ?? (slug === "/" ? pathname === "/" : pathname.includes(slug)),
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
