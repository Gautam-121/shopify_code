import { DataTypes } from "sequelize";
import { sequelize } from "../../server/postgreSql.js";

const ActiveStores = sequelize.define('ActiveStores', {
  shop: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
  },
  is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
});

export default ActiveStores;
