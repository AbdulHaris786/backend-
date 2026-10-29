const User = require("../models/user.model.js");
const UserProfile = require("../models/user.profile.model.js");
const bcrypt=require('bcrypt'); 
const jwtservice = require("../jwt/token.service.js");

class UserService {
  async signup(name, email, password) {
    const existinguser = await User.findOne({email});
    if(existinguser){
      throw new Error("Email already taken!");

    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const user = await User.create({name,email,password:hashedPassword});
    return user;
  }
 async loginUser(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.isActive) {
        throw new Error("User account is inactive");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const payload = {
        id: user._id,
        email: user.email,
        isActive: user.isActive
    };

    const token = jwtservice.generateToken(payload);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
        user: userWithoutPassword,
        token
    };
}
async createUserProfile(userId, profileData = {}) {
        const user = await User.findOne({ _id: userId, isActive: true });

        if (!user) {
            throw new Error("User not found");
        }

       const userProfile = await UserProfile.create({
        user: userId,
        age: profileData.age,
        dob: profileData.dob,
        bio: profileData.bio
       });

        return userProfile;
    }
       
async updateUser(id, updateData) {

        const data = { ...updateData }
       
        const user = await User.findByIdAndUpdate(id,
            data, {
            new: true,
            runValidators: true
        }
        );

        if (!user) {
            throw new Error("User not found");
        }
        return user;

    }
async softdeleteUser(id) {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        {
            new: true,
            runValidators: true
        }
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

async getalluserWithoutPop() {
        const users = await User.find({ isActive: true });
        const userIds = users.map((user) => user._id);
        const userProfiles = await UserProfile.find({ user: { $in: userIds } });

        const usersWithProfiles = users.map((user) => {
            const profile = userProfiles.find(
                (userProfile) => userProfile.user.toString() === user._id.toString()
            );

            return {
                ...user.toObject(),
                profile: profile || null,
            };
        });

        return usersWithProfiles;
    }

}

module.exports = new UserService();