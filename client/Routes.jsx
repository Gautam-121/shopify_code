import React from "react";

import ExitFrame from "./ExitFrame";

import LandingPage from "./pages/LandingPage";
import DebugIndex from "./pages/debug/Index";
import BillingAPI from "./pages/debug/Billing";
import GetData from "./pages/debug/Data";
import ActiveWebhooks from "./pages/debug/Webhooks";
import CreateNotification from './pages/CreateNotification'
// import Segment from "./pages/Index"

const routes = {
  "/": () => <GetData/>,
  "/exitframe": () => <ExitFrame />,
  "/exitframe/:shop": ({ shop }) => <ExitFrame shop={shop} />,
  //Debug Cards
  "/debug": () => <DebugIndex />,
  "/debug/webhooks": () => <ActiveWebhooks />,
  // "/debug/data": () => <GetData />,
  "/debug/billing": () => <BillingAPI />,
  "/createnotification":()=><CreateNotification/>
  //Add your routes here
};

export default routes;
