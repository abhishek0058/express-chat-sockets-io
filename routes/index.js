var express = require('express');
var router = express.Router();

const Message = require("../models/message");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ status: true });
});

router.get("/all-messages-from-users", (req, res) => {
  const messages = await Message.aggregate([
    {
      $group: {
        _id: { sender: "$sender", group: "$group" },
        messages: { $push: { text: "$text" } }
      }
    }
  ]);

  res.json({ messages });

});

router.get("/all-messages-from-groups", (req, res) => {
  const messages = await Message.aggregate([
    {
      $group: {
        _id: "$group",
        messages: { $push: { text: "$text", sender: "$sender" } }
      }
    }
  ]);

  res.json({ messages });

});

module.exports = router;
