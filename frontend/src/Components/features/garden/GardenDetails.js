import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { selectGardenById } from "../../../app/api/gardensApiSlice";

import GardenDetailsPage from "./GardenDetailsPage";

const GardenDetails = () => {
  const { id } = useParams();

  const garden = useSelector((state) => selectGardenById(state, id));

  const content = garden ? (
    <GardenDetailsPage garden={garden} />
  ) : (
    <Box sx={{ display: "flex", marginTop: 8, alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );

  return content;
};
export default GardenDetails;
