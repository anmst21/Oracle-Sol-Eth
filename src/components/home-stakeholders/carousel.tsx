import React from "react";
import Link from "next/link";
import { EmblaViewportRefType } from "embla-carousel-react";

type Props = {
  stakeholders: {
    header: string;
    key: string;
    uri: string;
    description: string;
    type: string;
    icon: string;
    width: number;
    height: number;
  }[];
  ref: EmblaViewportRefType;
};

const MobileCarousel = ({ stakeholders, ref }: Props) => {
  return (
    <div className="mobile-carousel" ref={ref}>
      <div className="mobile-carousel__container">
        {stakeholders.map((item, i) => {
          return (
            <Link
              href={item.uri}
              key={i}
              className="mobile-carousel-item"
            ></Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCarousel;
