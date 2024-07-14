import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React, { useState, useEffect } from "react";

type CustomSnackbarProps = {
  message?: string;
  severity?: AlertProps["severity"];
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  autoHideDuration?: number;
  onParentClose?: () => void;
  open: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export default function CustomSnackbar({
  message = "",
  severity = "success",
  anchorOrigin = { vertical: "top", horizontal: "center" },
  autoHideDuration = 4000,
  onParentClose,
  open,
}: CustomSnackbarProps) {
  const handleClose = () => {
    onParentClose && onParentClose();
  };

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={!!open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      message={message}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
