const router = require("express").Router();
const controller = require("./controller");
const multer = require("multer");
const checkAuth = require("./methods").checkAuth;

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
router.put("/changePassword", checkAuth, controller.changePassword);

router.get("/getUser", checkAuth, controller.getUser);
router.delete("/deleteUser", checkAuth, controller.deleteUser);
router.put(
  "/changePhoto",
  checkAuth,
  upload.single("photo"),
  controller.changePhoto
);

router.get("/getAllRooms", checkAuth, controller.getAllRooms);
router.post("/createRoom", checkAuth, controller.createRoom);
router.get("/getUsersInRoom", checkAuth, controller.getUsersInRoom);

router.post("/postChat", checkAuth, controller.postChat);
router.get("/getChatHistory", checkAuth, controller.getChatHistory);
router.delete("/clearChatHistory", checkAuth, controller.clearChatHistory);

module.exports = router;
