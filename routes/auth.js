var express = require("express");
var router = express.Router();

const { admin_login } = require("../controller/auth");

router.post("/admin-login", admin_login);

module.exports = router;