import HeaderIcon from "../home-section-header/header-icon";

const ItemText = ({
  animation,
  header,
  paragraph,
}: {
  animation: unknown;
  header: string;
  paragraph: string;
}) => {
  return (
    <div className="about-text">
      <HeaderIcon animation={animation} />
      <h3>{header}</h3>
      <p>{paragraph}</p>
    </div>
  );
};

export default ItemText;
