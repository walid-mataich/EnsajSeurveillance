import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

function ExamProgress({ completed, total }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      className="bg-neutral-50 p-4 rounded-md shadow-md"
    >
      <Typography variant="h6" fontWeight="bold">
        Progression des Examens
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={progress}
          size={100}
          thickness={5}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" fontWeight="bold">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1">
        {completed} / {total} examens terminés
      </Typography>
    </Box>
  );
}

export default ExamProgress;
