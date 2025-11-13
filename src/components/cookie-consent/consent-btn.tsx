import React from "react";

type ConsentBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  callback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const ConsentBtn: React.FC<ConsentBtnProps> = ({
  children,
  callback,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (callback) {
      callback(e);
    }

    if (onClick) {
      if (e.persist) e.persist();

      setTimeout(() => {
        onClick(e);
      }, 400);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      <span>{children}</span>
    </button>
  );
};

export default ConsentBtn;
