'use client'

import { ILocalizationsContext, LocalizationsContext } from "@futurebrand/contexts/localizations";
import { useContext } from "react";

export function useLocalizations(): ILocalizationsContext {
  return useContext(LocalizationsContext)
}
