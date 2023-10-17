import SessionModel from "../../utils/models/SessionModel.js";

const serverKey= async(req , res )=>{
try{
    const {serverKey} = req?.body
    const shop = req?.query?.shop;

    console.log(serverKey , shop)
  
    if(!serverKey){
      return res.status(400).json({
        success : false,
        message : "Server Key missing"
      })
    }
  
    const storeData = await SessionModel.update(
      { serverKey: serverKey },
      { where: { shop: shop } }
    );

    console.log(storeData)
  
    if(!storeData){
      return res.status(400).json({
        success : false,
        message : "Failure to update ServerKey"
      })
    }
  
    return res.status(200).json({
      success : true,
      message : "ServerKey set Succeessufull"
    })
}catch(error){
    console.error("Error:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ success: false, error: "Internal Server Error" });
  };
};

export default serverKey;