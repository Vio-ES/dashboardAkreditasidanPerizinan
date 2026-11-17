import { useState, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";

export type Roles = "admin" | "asesor" | null;

export const UserContext = createContext<Roles>(null);
