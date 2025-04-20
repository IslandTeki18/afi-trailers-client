import * as React from "react";
import { AppRoutes } from "./routes";
import { store } from "../stores/redux/store";
import { Provider } from "react-redux";
import { AuthProvider } from "~src/features/auth";

export function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </AuthProvider>
  );
}
