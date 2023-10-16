import { Sequelize } from "sequelize";

export const sequelize =new Sequelize ({
    dialect: 'postgres',
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
});


// export const connectSql =async () => {
//   const sequelize = new Sequelize("notify", "postgres", "987654", {
//     host: "localhost",
//     dialect: "postgres",
//   });

//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     // User=userModel(sequelize);
//     // await sequelize.sync();
//     console.log('table created successfully')
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };
