const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


const app = require("./app");
const mongoose = require("mongoose");

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
})
.then( () => console.log('DB connection successful') );

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});

// handling all the rejected promise errors. Ex: if messed up with DB pass
// process.on('unhandledRejection', err => {
//   console.log(err.name, err.message);
// });

// // handling uncaught Exceptions. Ex: logging something which doesn't exists
// process.on('uncaughtException', err => {   
//   // console.log(err.name, err.message);
//   console.log(err);
// });

   