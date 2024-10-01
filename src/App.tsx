import * as React from "react";
import { AppRoutes } from "./routes";
import { RecoilInitializer } from "~src/stores";

export function App() {
  return (
    <RecoilInitializer>
      <AppRoutes />
    </RecoilInitializer>
  );
}
