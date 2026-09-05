import React from "react";
import { createRoot } from "react-dom/client";
import FBYPitch from "./FBYPitch.jsx";
import FBYPitchLite from "./FBYPitchLite.jsx";

// default → versión corta (6 slides), la que se presenta
// ?full   → versión completa (13 slides), respaldo con roadmap e inversión
const full = new URLSearchParams(window.location.search).has("full");

createRoot(document.getElementById("root")).render(full ? <FBYPitch /> : <FBYPitchLite />);
