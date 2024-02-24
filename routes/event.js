var express = require("express");
var router = express.Router();

const { get_event, create_event, register_event } = require("../controller/event");

router.get("/get-event", get_event);

router.post("/create-event", create_event);

router.post("/register-event", register_event);

module.exports = router;