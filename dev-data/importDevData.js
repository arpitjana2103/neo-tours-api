const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Models = {
    Tours: require("./../models/tour.model"),
};

dotenv.config({ path: `${__dirname}/../config.env` });

const DBLOC = process.env.DATABASE_LOCAL;

const connectDB = async function () {
    await mongoose.connect(DBLOC);
    console.log("DB connection successfull!");
};

// READ JSON FILE
const readData = function (fileName) {
    const data = fs.readFileSync(`${__dirname}/${fileName}.json`, "utf-8");
    return JSON.parse(data);
};

// DELETE ALL DATA FROM DB
const deleteData = async function (fileName) {
    try {
        await Models[fileName].deleteMany();
        console.log("Previous data deleted successfully");
    } catch (error) {
        console.log(error);
    }
};

// IMPORT DATA INTO DB
const importData = async function (fileName) {
    const data = readData(fileName);
    try {
        await deleteData(fileName);
        await Models[fileName].create(data);

        console.log("Data imported successfully");
    } catch (error) {
        console.log(error);
    }

    process.exit();
};

(async function () {
    const fileName = process.argv[2];
    try {
        await connectDB();
        await importData(fileName);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.log(error);
        await mongoose.connection.close();
        process.exit(1);
    }
})();
