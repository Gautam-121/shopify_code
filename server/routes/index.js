import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import subscriptionRoute from "./recurringSubscriptions.js";
import getAllSegment from  "../controllers/getSegment.js";
import sendNotification from "../controllers/sendNotification.js";
import dotenv from "dotenv";
dotenv.config();
import Cryptr from "cryptr";
import serverKey from "../controllers/serverKey.js";
import getServerKey from "../controllers/getServerKey.js";


const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const userRoutes = Router();
userRoutes.use(subscriptionRoute);

userRoutes.get("/api", (req, res) => {
  const sendData = { text: "This is coming from /apps/api route." };
  return res.status(200).json(sendData);
});

userRoutes.post("/api", (req, res) => {
  console.log("Route hit");
  return res.status(200).json(req.body);
});

userRoutes.get("/api/gql", async (req, res) => {
  //false for offline session, true for online session
  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: false,
  });

  const shop = await client.query({
    data: `{
      shop {
        name
      }
    }`,
  });

  return res.status(200).json({ text: shop.body.data.shop.name });
});

userRoutes.get("/api/activeWebhooks", async (req, res) => {
  const { client } = await clientProvider.graphqlClient({
    req,
    res,
    isOnline: true,
  });
  const activeWebhooks = await client.query({
    data: `{
      webhookSubscriptions(first: 25) {
        edges {
          node {
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
        }
      }
    }`,
  });
  return res.status(200).json(activeWebhooks);
});

userRoutes.get("/api/getSegment", getAllSegment)

userRoutes.post("/api/sendNotificatication", sendNotification)

userRoutes.get("/api/getServerkey",getServerKey)

userRoutes.post("/api/updateServerKey",serverKey)

export default userRoutes;
