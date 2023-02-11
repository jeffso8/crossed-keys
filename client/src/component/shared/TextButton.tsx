type TextButtonPropsType = {
  text: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style: React.CSSProperties;
};

export const TextButton = ({
  text,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TextButtonPropsType) => {
  return (
    <div
      className={"button"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        fontSize: 20,
        cursor: "pointer",
        fontFamily: "Clearface",
        fontWeight: 600,
        letterSpacing: "1px",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
