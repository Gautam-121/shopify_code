import StoreModel from "../../utils/models/StoreModel.js";

const isShopActive = async (req, res, next) => {
  const { shop, host } = req.query;

  if (!shop) {
    next();
    return;
  }
  

  try {
    // Use Sequelize to find the store
    const isShopAvailable = await StoreModel.findOne({ where: { shop } });

    if (isShopAvailable === null || !isShopAvailable.isActive) {
      if (isShopAvailable === null) {
        // Use Sequelize to create a new store
        await StoreModel.create({ shop, isActive: false });
      } else if (!isShopAvailable.isActive) {
        // Use Sequelize to update the existing store
        await StoreModel.update({ isActive: false }, { where: { shop } });
      }
      res.redirect(`/auth?shop=${shop}&host=${host}`);
    } else {
      next();
    }
  } catch (error) {
    // Handle errors appropriately
    console.error('Error in isShopActive:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default isShopActive;
