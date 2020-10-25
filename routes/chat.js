var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const Message = require("../models/message");


router.get("/all-messages-from-users", async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $group: {
          _id: { sender: "$sender", group: "$group" },
          messages: { $push: { text: "$text", seenAt: "$seenAt" } }
        }
      }
    ]);

    res.json({ messages });

  } catch (error) {
    console.log("", error);
    res.json({ success: false, error: "An Internal Error has occurred." });
  }
});

router.get("/all-messages-from-groups", async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $group: {
          _id: "$group",
          messages: { $push: { text: "$text", sender: "$sender", seenAt: "$seenAt" } }
        }
      }
    ]);

    res.json({ messages });
  } catch (error) {
    console.log("", error);
    res.json({ success: false, error: "An Internal Error has occurred." });
  }
});

router.get("/get-messages-by-user/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const groups = await Message.aggregate([
      { $match: { sender: new ObjectId(user) } },
      {
        $group: {
          _id: "$group",
          messages: {
            $push: { text: "$text", sender: "$sender", seenAt: "$seenAt", receiver: "$receiver" }
          }
        }
      }
    ]);

    const response = groups.map(group => {
      const { _id, messages } = group;
      const unSeenCount = getUnSeenCount(messages);
      return { group: _id, messages, unSeenCount };
    })

    res.json({ userMessagesByGroup: response });

  } catch (error) {
    console.log("", error);
    res.json({ success: false, error: "An Internal Error has occurred." });
  }
});

router.get("/get-messages-by-group/:group", async (req, res) => {
  try {
    const { group } = req.params;
    const messages = await Message.find({ group }).lean();
    const unSeenCount = getUnSeenCount(messages);
    res.json({ messages, unSeenCount });

  } catch (error) {
    console.log("", error);
    res.json({ success: false, error: "An Internal Error has occurred." });
  }
});

module.exports = router;


function getUnSeenCount(messages = []) {
  let unSeenCount = 0;
  for (let i = messages.length; i >= 0; i++) {
    const { seenAt } = messages[i];
    if (!seenAt) unSeenCount++;
    else return unSeenCount;
  }
  return unSeenCount;
}