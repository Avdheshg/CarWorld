const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// getting Mongoose Model and Schema for NEW CARS
const NewCars = require("./../../models/newCarsModel");

// USED CARS
const UsedCars = require("./../../models/usedCarModel");

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
  .then(() => console.log("DB connection successful"));

// read the NEW CARS FILE
const newCars = JSON.parse(
  fs.readFileSync(`${__dirname}/newCars.json`, "utf-8")
);

// read the USED CARS FILE
const usedCars = JSON.parse(
  fs.readFileSync(`${__dirname}/usedCars.json`, "utf-8")
); 

// console.log(usedCars);

// ========  set the data to MDB ========
// new cars
const importData = async () => {
  try {
    await NewCars.create(newCars);
    console.log("Data successfully loaded ***********");
  } catch (err) {
    console.log(err);
  }
  process.exit();   
};

// used cars
const importDataUsedCars = async () => {
  try {
    const cars = await UsedCars.create(usedCars);
    // console.log("Data successfully loaded ***********", cars);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete new cars data
const deleteNewCars = async () => {
  try {
    await NewCars.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteUsedCars = async () => {
  try {
    await UsedCars.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--importNewCars") {
  importData();
} else if (process.argv[2] === "--importUsedCars") {
  importDataUsedCars();
} else if (process.argv[2] === "--deleteNewCars") {
  deleteNewCars();
} else if (process.argv[2] === "--deleteUsedCars") {
  deleteUsedCars();
}

// console.log(process.argv);
// For Executing
//  node dev-data/data/import-dev-data.js --delete

