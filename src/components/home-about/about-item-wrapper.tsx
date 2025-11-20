import { HomeSectionCross } from "../icons";

type Props = {
  key: string;
  length: number;
  index: number;
  children: React.ReactNode;
};

const AboutItemWrapper = ({ key, length, index, children }: Props) => {
  return (
    <div className={`home-about-icon home-about-icon--${key}`}>
      <div className="home-about-icon__cross home-about-icon__cross--1">
        <HomeSectionCross />
      </div>
      <div className="home-about-icon__cross home-about-icon__cross--2">
        <HomeSectionCross />
      </div>
      <div className="home-about-icon__cross home-about-icon__cross--3">
        <HomeSectionCross />
      </div>
      {length === index + 1 && (
        <>
          <div className="home-about-icon__cross home-about-icon__cross--4">
            <HomeSectionCross />
          </div>
          <div className="home-about-icon__cross home-about-icon__cross--5">
            <HomeSectionCross />
          </div>
          <div className="home-about-icon__cross home-about-icon__cross--6">
            <HomeSectionCross />
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export default AboutItemWrapper;
