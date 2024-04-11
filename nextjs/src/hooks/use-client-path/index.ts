import { useContext } from "react";
import { ClientPathContext } from "@futurebrand/contexts";

export function useClientPath ()  {
  return useContext(ClientPathContext)
}

