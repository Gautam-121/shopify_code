import { DataTypes } from "sequelize";
import { sequelize } from "../../server/postgreSql.js";

const Session = sequelize.define("session", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serverKey: {
    type: DataTypes.STRING,
    allowNull: true, 
  },

});

export default Session;
