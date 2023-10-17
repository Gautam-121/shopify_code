import SessionModel from "../../utils/models/SessionModel.js";
import StoreModel from "../../utils/models/StoreModel.js";

/**
 * @typedef { import("../../_developer/types/2023-07/webhooks.js").APP_UNINSTALLED } webhookTopic
 */

const appUninstallHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  /** @type {webhookTopic} */
  const webhookBody = JSON.parse(webhookRequestBody);
  try {
    // Use Sequelize to update the store model
    await StoreModel.update({ isActive: false }, { where: { shop } });

    // Use Sequelize to delete sessions
    await SessionModel.destroy({ where: { shop } });
  } catch (error) {
    // Handle errors appropriately
    console.error('Error in appUninstallHandler:', error);
    throw error;
  }
  // await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
  // await SessionModel.deleteMany({ shop });
};

export default appUninstallHandler;
