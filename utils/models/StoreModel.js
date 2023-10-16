import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true, default: false },
});

const StoreModel = mongoose.model("Active_Stores", StoreSchema);

export default StoreModel;

// import { DataTypes } from "sequelize";
// import { sequelize } from "../../server/postgreSql.js";

// const ActiveStores = sequelize.define('ActiveStores', {
//   shop: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//   },
//   is_active: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//   },
// });

// export default ActiveStores;
