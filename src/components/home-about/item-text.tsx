import HeaderIcon from "../home-section-header/header-icon";
import TextReveal from "../text-reveal";

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
      <TextReveal as="h3">{header}</TextReveal>
      <TextReveal as="p" delay={100}>{paragraph}</TextReveal>
    </div>
  );
};

export default ItemText;
