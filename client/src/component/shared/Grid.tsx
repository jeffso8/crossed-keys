import { Grid as MaterialGrid, GridProps } from "@mui/material";

const Grid: React.FC<GridProps> = (props) => {
  return <MaterialGrid sm md lg xl {...props} />;
};

export default Grid;
