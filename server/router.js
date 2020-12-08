const router = require("express").Router();
const controller = require("./controller");
const multer = require("multer");

const DIR = "src/uploads";
var photo;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    photo = Date.now() + file.originalname;
    cb(null, photo);
  },
});
let upload = multer({ storage: storage });

router.post("/signup", upload.single("photo"), controller.signUp);
router.post("/login", controller.logIn);
router.put("/changePassword", controller.changePassword);

router.get("/getUser", controller.getUser);
router.delete("/deleteUser", controller.deleteUser);
router.put("/changePhoto", upload.single("photo"), controller.changePhoto);

router.get("/getAllRooms", controller.getAllRooms);
router.post("/createRoom", controller.createRoom);
router.get("/getUsersInRoom", controller.getUsersInRoom);

router.post("/postChat", controller.postChat);
router.get("/getChatHistory", controller.getChatHistory);
router.delete("/clearChatHistory", controller.clearChatHistory);

module.exports = router;
