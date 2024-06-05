import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: Array(25)
    .fill("none")
    .map((v, i) =>
      i === 1
        ? "0px 2px 4px -1px rgba(0,0,0,0.02), 0px 4px 5px 0px rgba(0,0,0,0.05), 0px 1px 10px 0px rgba(0,0,0,0.05)"
        : v
    ),
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
