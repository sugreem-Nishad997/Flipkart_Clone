import { CircularProgress } from "@mui/material";
import '../styles/Spinner.css';
export default function Spinner() {
  return (
    <div className="spinner">
      <CircularProgress color="primary"/>
    </div>
  );
}