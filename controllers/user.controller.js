const userServices = require("../services/user.service.js");

class UserController {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const result = await userServices.signup(name, email, password);
      const user = result.toObject();
      delete user.password;
      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Both "email" and "password" are required'
                });
            }

            const loginData = await userServices.loginUser(email, password);

            return res.status(200).json(loginData);

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }



    async getalluser(req,res){
        try {
            
        const result = await userServices.getalluserWithoutPop();
        return res.status(200).json({
            count: result.length,
            message:"user fetched successfully",data:result})

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({message:error.message})
            
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await userServices.updateUser(id, updateData);
            console.log(result)
            return res.status(200).json({
                success: true,
                message: "User updated Successfully",
                data: result
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        } 
    }
    async softdeleteUser(req, res) {
        try {
            const { id } = req.params;

            const result = await userServices.softdeleteUser(id);

            return res.status(200).json({
                success: true,
                message: "User soft deleted successfully",
                data: result
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async addUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const { age, dob, bio } = req.body;

            if (!userId) {
                return res.status(400).json({ message: "User Id is required" });
            }

            const newUserProfile = await userServices.createUserProfile(userId, { age, dob, bio });
            return res.status(201).json(newUserProfile);
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: "A profile for this user already exists" });
            }

            console.log(err);
            return res.status(409).json({ error: err.message });
        }
    }
    async getAllUserwithoutPop(req, res) {
        try {
            const result = await userServices.getalluserWithoutPop();
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                count: result.length,
                data: result
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}


module.exports = new UserController();