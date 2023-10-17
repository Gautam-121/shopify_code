import { Session } from "@shopify/shopify-api";
import Cryptr from "cryptr";
import SessionModel from "./models/SessionModel.js"

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

const storeSession = async (session) => {
// ------postgresql-----
  const encryptedContent = cryption.encrypt(JSON.stringify(session));

  const [result, created] = await SessionModel.upsert({
    id: session.id,
    content: encryptedContent,
    shop: session.shop,
  });

  return created;

  // await SessionModel.findOneAndUpdate(
  //   { id: session.id },
  //   {
  //     content: cryption.encrypt(JSON.stringify(session)),
  //     shop: session.shop,
  //   },
  //   { upsert: true }
  // );

  // return true;
};

const loadSession = async (id) => {
// ------postgresql------
  const sessionResult = await SessionModel.findByPk(id);

  if (!sessionResult) {
    return undefined;
  }

  const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
  const returnSession = new Session(sessionObj);
  return returnSession;

  // const sessionResult = await SessionModel.findOne({ id });
  // if (sessionResult === null) {
  //   return undefined;
  // }
  // if (sessionResult.content.length > 0) {
  //   const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
  //   const returnSession = new Session(sessionObj);
  //   return returnSession;
  // }
  // return undefined;
};

const deleteSession = async (id) => {
  // ------postgresql------
  const result = await SessionModel.destroy({
    where: { id },
  });

  return result > 0;
  
  // await SessionModel.deleteMany({ id });
  // return true;
};

const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
