const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


// handling incoming requests to /products
router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_new);

router.get("/:productId", ProductsController.products_get_one);

router.patch("/:productId", checkAuth, ProductsController.products_update);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;