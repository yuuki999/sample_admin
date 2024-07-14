import { useState, CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Loading() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <PulseLoader
        color="#007aff"
        loading={loading}
        cssOverride={override}
        size={8}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
