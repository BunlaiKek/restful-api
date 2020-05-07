const express = require("express");
const router = express.Router();
const UsersControlller = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

// handling incoming requests to /users
router.post("/signup", UsersControlller.users_signup);

router.post("/login", UsersControlller.users_login);

router.delete("/:userId", checkAuth, UsersControlller.users_delete);

module.exports = router;