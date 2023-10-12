import { Router } from "express";
import clientProvider from "../../utils/clientProvider.js";
import subscriptionRoute from "./recurringSubscriptions.js";
// import getAllSegment from  "../controllers/getAllSegment.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Cryptr from "cryptr";
import SessionModel from "../../utils/models/SessionModel.js";

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

userRoutes.get("/api/getSegment",async (req, res) => {
  try {
    const shop = req.query.shop;
    const sessionDetail = await SessionModel.findOne({ shop: shop });
    if (sessionDetail === null) {
      return undefined;
    }
    if (sessionDetail.content.length == 0) {
      return undefined;
    }
    const sessionObj = JSON.parse(cryption.decrypt(sessionDetail.content));

    const { accessToken } = sessionObj;
    console.log(accessToken)

    const shopifyGraphQLEndpoint = `https://${sessionDetail.shop}/admin/api/2023-04/graphql.json`;

    const graphqlQuery = `
      {
        segments(first: 100) {
          edges {
            node {
              creationDate
              id
              lastEditDate
              name
              query
            }
          }
        }
      }
    `;

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    };

    const response = await axios.post(
      shopifyGraphQLEndpoint,
      { query: graphqlQuery },
      axiosConfig
    );

    const segments = response.data.data.segments.edges.map((edge) => edge.node);

    res.status(200).json({ success: true, segments });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
})

export default userRoutes;
