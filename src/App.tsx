import * as React from "react";
import { AppRoutes } from "./routes";
import { store } from "./stores/redux/store";
import { Provider} from "react-redux"

export function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
