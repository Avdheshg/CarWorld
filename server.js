const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const mongoose = require("mongoose");

// console.log(process.env);

/* ================================= CORS */
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
/* ================================= */

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});

   

