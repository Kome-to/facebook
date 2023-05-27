const router = require("express").Router();
const { authUser } = require("../middlwares/auth");

const notifyCtrl = require("../controllers/notify");

router.post("/notify", authUser, notifyCtrl.createNotify);

router.delete("/notify/:id", authUser, notifyCtrl.removeNotify);

router.get("/notifies", authUser, notifyCtrl.getNotifies);

router.put("/isReadNotify", authUser, notifyCtrl.isReadNotify);

router.delete("/deleteAllNotify", authUser, notifyCtrl.deleteAllNotifies);

module.exports = router;
