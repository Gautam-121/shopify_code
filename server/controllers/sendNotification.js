import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Cryptr from "cryptr";
import SessionModel from "../../utils/models/SessionModel.js";

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);
// const { shop, shopifyApiAccessToken } = process.env;

const sendNotification = async (req, res) => {
    try{
    const shop = req.query.shop;
    console.log(req)
    const sessionDetail = await SessionModel.findOne({ shop: shop });

    if (sessionDetail === null) {
      return undefined;
    }
    if (sessionDetail.content.length == 0) {
      return undefined;
    }
    const sessionObj = JSON.parse(cryption.decrypt(sessionDetail.content));

    const { accessToken} = sessionObj;
    console.log("from notif api" , accessToken)

  const shopifyGraphQLEndpoint = `https://${shop}/admin/api/2023-04/graphql.json`;
console.log(req.body)
  const { title, body, segments: segmentSelected } = req.body.notificationMessage;

  // console.log("request body is" + req.body?.notificationMessage?.segmentSelected )


  // At any case if one of three is not send throw error
  if (!title || !body || segmentSelected.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please Provide title message and selected Segment",
    });
  }

  console.log(title , body , segmentSelected)

  // Set up the Axios request config for shopify
  const axiosShopifyConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
  };

  // Set up the Axios request config for firebase
  const axiosFirebaseConfig = {
    headers: {
      Authorization: `key=${sessionDetail.serverKey}`,
      "Content-Type": "application/json",
    },
  };

  let topics_combined = "";
  for (let index = 0; index < segmentSelected.length; index++) {
    const topicName = segmentSelected[index].replace(/\W+/g, '_'); // Replace non-alphanumeric characters with underscores
    topics_combined += `('${topicName}' in topics)`;

    if (index < segmentSelected.length - 1) topics_combined += " || ";

    //   const customer_in_Segment = `{
    //   customers(query: "${segmentSelected[index]._id}") {
    //     edges {
    //       node {
    //         metafield(key: "Firebase_Token") {
    //           key
    //           type
    //           value
    //         }
    //       }
    //     }
    //   }
    // }`
    //   // Send the GraphQL query request using Axios for customer
    //   const customers = await axios.post(shopifyGraphQLEndpoint, { query: customer_in_Segment }, axiosShopifyConfig);

    //   // accessing firebase_token of each customer
    //   const customerRegistrationToken = customers.map(customer => customerRegistrationToken.push(customer?.metafields?.Firebase_Token))

    // Subscribe to the topic
    console.log(topics_combined)
    await axios.post(
      "https://iid.googleapis.com/iid/v1:batchAdd",
      {
        to: `/topics/${topicName}`,
        registration_tokens: [
          "dLPRXoI3nkyeq8s0LiEGjA:APA91bFvWdu3yBpKMRAr1BDacTvF9P9Bk6zjHVqvLLhyOi_KkFmwAyeEkus4w20dkXdY68bEPric-37etPPOBniQeX4UOSCiWRlQE-MZfEPmCWmn4nh8TCg00tbtS6ovflbmg_UW4HJT",
        ],
      },
      axiosFirebaseConfig
    );
  }

  console.log(topics_combined);
  const sendMessage = {
    notification: {
      body: body,
      title: title,
    },
    //   condition: '\'segment1\' in topics || \'segment7\' in topics'
    condition: topics_combined,
  };

  //axios request for sendingPushNotification
  const sendNotification = await axios.post(
    "https://fcm.googleapis.com/fcm/send",
    sendMessage,
    axiosFirebaseConfig
  );

  console.log(sendNotification.data);

  return res.status(200).json({
    success: true,
    message: "Notification Send Successfylly",
  });
}catch (error) {
    console.error("Error:", error);
    // Handle the error and send an appropriate response
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  };
}

export default sendNotification;