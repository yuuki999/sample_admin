import React, { createContext, useContext, useState } from 'react';
import CustomSnackbar from '../_components/ui/CustomSnackbar';

interface SnackbarContextProps {
  showSnackbarMessage: (message: string, severity: "success" | "error" | "warning" | "info") => void;
}
const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbarMessage = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbarData({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbarData(prevState => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbarMessage }}>
      {children}
      <CustomSnackbar
        severity={snackbarData.severity}
        open={snackbarData.open}
        onParentClose={closeSnackbar}
        message={snackbarData.message}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
