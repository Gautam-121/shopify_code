import React from "react";

import ExitFrame from "./ExitFrame";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import DebugIndex from "./pages/debug/Index";
import BillingAPI from "./pages/debug/Billing";
import GetData from "./pages/debug/Data";
import ActiveWebhooks from "./pages/debug/Webhooks";
import Notification from "./pages/Notification";
// import Segment from "./pages/Index"

const routes = {
  "/": () => <Landing/>,
  "/exitframe": () => <ExitFrame />,
  "/exitframe/:shop": ({ shop }) => <ExitFrame shop={shop} />,
  //Debug Cards
  "/debug": () => <DebugIndex />,
  "/debug/webhooks": () => <ActiveWebhooks />,
  // "/debug/data": () => <GetData />,
  "/debug/billing": () => <BillingAPI />,
  "/createnotification":()=><GetData/>
  //Add your routes here
};

export default routes;
