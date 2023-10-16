// Session store model to preserve sessions across restarts.
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
  serverKey:{
    type:String,
    default:null,
  }
});

const SessionModel = mongoose.model("session", sessionSchema);

export default SessionModel;


/*
import { DataTypes } from 'sequelize';
import { sequelize } from '../../server/postgreSql.js';

const Session = sequelize.define('session', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Session;
 */