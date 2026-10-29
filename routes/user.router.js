const express = require("express")
const router = express.Router(); 
const usercontroller = require("../controllers/user.controller.js")
const protect=require("../middleware/auth.middleware.js");

router.post("/signup",usercontroller.signup);
router.post("/login",usercontroller.login);
router.get("/mems",protect,usercontroller.getalluser);
router.post("/profile",protect,usercontroller.addUserProfile);
router.put("/update/:id",usercontroller.updateUser);
router.delete("/delete/:id",usercontroller.softdeleteUser);
router.get("/pop",protect,usercontroller.getAllUserwithoutPop);
module.exports = router