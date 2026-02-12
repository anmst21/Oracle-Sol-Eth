import React from "react";
import ItemObject from "./item-object";
import classNames from "classnames";
import AboutItemWrapper from "./about-item-wrapper";
import ItemText from "./item-text";
type Props = {
  itemKey: string;
  length: number;
  index: number;
  header: string;
  paragraph: string;
  animation: unknown;
  object: string;
  colorTop: string;
  colorBottom: string;
  rotation: number[];
  position: number[];
};

const AboutItem = ({
  itemKey,
  length,
  index,
  header,
  paragraph,
  animation,
  object,
  rotation,
}: Props) => {
  const isNormal = itemKey === "swap" || itemKey === "bridge";
  const isInverted = itemKey === "buy" || itemKey === "send";
  return (
    <AboutItemWrapper isIndex keyString={itemKey} length={length} index={index}>
      <div
        className={classNames("home-about-icon__info", {
          "info-no-padding": isInverted,
        })}
      >
        {isNormal ? (
          <ItemText
            header={header}
            paragraph={paragraph}
            animation={animation}
          />
        ) : (
          <ItemObject objectUri={object} rotation={rotation} />
        )}
      </div>
      <div
        className={classNames("home-about-icon__animation", {
          "info-no-padding": isNormal,
        })}
      >
        {isInverted ? (
          <ItemText
            header={header}
            paragraph={paragraph}
            animation={animation}
          />
        ) : (
          <ItemObject objectUri={object} rotation={rotation} />
        )}
      </div>
    </AboutItemWrapper>
  );
};

export default AboutItem;
