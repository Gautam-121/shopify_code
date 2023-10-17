import SessionModel from "../../utils/models/SessionModel.js";

const getServerKey = async (req, res) => {
  try {
    const shop = req.query.shop;
    console.log(req);
    const sessionDetail = await SessionModel.findOne({ where: { shop: shop } });

    if (!sessionDetail || !sessionDetail.serverKey) {
      return res
        .status(404)
        .json({ success: false, error: "Server key not found" });
    }

    const serverKey = sessionDetail.serverKey;

    res.status(200).json({ success: true, serverKey: serverKey });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error and send an appropriate response
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export default getServerKey;