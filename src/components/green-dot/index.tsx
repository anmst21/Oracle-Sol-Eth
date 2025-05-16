const GreenDot = ({ int, dec }: { int: string; dec: string }) => {
  return (
    <>
      <span>{int}</span>
      <span style={{ color: "#AEE900" }}>.</span>
      <span>{dec}</span>
    </>
  );
};

export default GreenDot;
