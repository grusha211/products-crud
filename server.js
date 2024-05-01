const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./lib/db");
const init = require("./lib/express");
const packageFile = require("./package.json");

//DB Connection
connectDB(() => {
  const app = init();

  const appStartMessage = () => {
    console.log("***********************************");
    console.log("API is Initialized");
    console.log(`App Name : products management`);
    console.log(`Server Name : ${packageFile.name}`);
    console.log(`Environment  : development`);
    console.log(`App Port : ${process.env.PORT}`);
    console.log(`Process Id : ${process.pid}`);
    console.log("***********************************");
  };

  app.listen(process.env.PORT, appStartMessage);
});
