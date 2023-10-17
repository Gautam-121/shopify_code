import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Cryptr from "cryptr";
import SessionModel from "../../utils/models/SessionModel.js";

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const getAllSegment = async (req, res) => {
  try {
    const shop = req.query.shop;
    console.log("console from segment",req.query.shop)
    const sessionDetail = await SessionModel.findOne({ where: { shop: shop } });
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
};

export default getAllSegment;