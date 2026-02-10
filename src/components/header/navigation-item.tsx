import classNames from "classnames";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  item: {
    title: string;
    slug: string;
    icon: React.JSX.Element;
    active: boolean;
    modal: React.JSX.Element | null;
  };
  setRef?: (node: HTMLDivElement | null) => void;
};

const NavigationItem = ({ item, setRef }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  return (
    <div
      onMouseEnter={() => setIsOpenModal(true)}
      onMouseLeave={() => setIsOpenModal(false)}
      className="header-navigation__item__wrapper"
    >
      <div
        ref={setRef}
        onClick={() => router.push(item.slug)}
        key={item.slug}
        className={classNames("header-navigation__item", {
          "header-navigation__item--active": item.active,
          "header-navigation__item--open": isOpenModal,
        })}
      >
        {item.icon}
        <span>{item.title}</span>
      </div>
      {item.modal && (
        <AnimatePresence mode="wait">
          {isOpenModal && item.modal}
        </AnimatePresence>
      )}
    </div>
  );
};

export default NavigationItem;
