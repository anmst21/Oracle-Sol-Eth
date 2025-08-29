import { ReactNode } from "react";

export type InputType = "fiat" | "crypto";

export type DocSpec = { name: string; icon: ReactNode; description: string };

export enum OracleRouteType {
  ORACLE = "oracle",
  DIRECT = "direct",
}
