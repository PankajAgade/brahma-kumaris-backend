var express = require("express");
var router = express.Router();

const { get_ticket, create_ticket } = require("../controller/ticket");

router.get("/get-ticket", get_ticket);

router.post("/create-ticket", create_ticket);

module.exports = router;