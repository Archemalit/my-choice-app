import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Results } from "./pages/Results";
import { Universities } from "./pages/Universities";
import { Strategy } from "./pages/Strategy";
import { Pricing } from "./pages/Pricing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "profile", Component: Profile },
      { path: "results", Component: Results },
      { path: "universities", Component: Universities },
      { path: "strategy", Component: Strategy },
      { path: "pricing", Component: Pricing },
    ],
  },
]);