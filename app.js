const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const morgan = require("morgan");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

mongoose.connect(
  "mongodb+srv://bunlai:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.3xt3r.mongodb.net/shop?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
