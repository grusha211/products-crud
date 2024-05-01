const express = require("express");
const cors = require("cors");
const jwt= require('jsonwebtoken');
const passport = require("passport");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const initRoutes = require("../app/routes");

// Initialize express app
const app = express();
app.use(cors());
app.use(passport.initialize());

function initMiddleware() {

  app.get("/healthy", (req, res) => {
    Responder.success(res, { status: 200 });
  });

  app.use(async function (req, res, next) {
    try {
      console.log("req.originalUrl====", req.originalUrl);

      let authToken = req.headers["authorization"];
      
      console.log("authToken : ", authToken);

      if (
        req.originalUrl == "/healthy" ||
        req.originalUrl == "/user/signup" ||
        req.originalUrl == "/user/verifyemail" ||
        req.originalUrl == "/user/login"
      )
        next();
      else if (authToken) {
        authToken = authToken.slice(7, authToken.length).trim();
        // Remove Bearer from string
        await passport.authenticate("jwt",{ session: false });
        next();
      } else {
        res.status(401).json({
          success: false,
          message: "Auth token is not supplied",
        });
      }
    } catch(err) {
      console.error("getting error while validate token:", err);
      res.status(500).send({ message: err.message });
    }
  });

  // Request body parsing middleware should be above methodOverride
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(methodOverride());
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function initErrorRoutes() {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      next();
    }

    console.log("err-inside-initErrorRoutes : ", err);
    // Return error
    res.status(400).send(err);
  });
}

const init = () => {
  // Initialize Express middleware
  initMiddleware();

  // Initialize modules server routes
  initRoutes(app);

  // Initialize error routes
  initErrorRoutes();

  return app;
};

module.exports = init;
