const bcrypt = require("bcrypt");
const Users = require("../models/user");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {

  console.log(req.body);

  const { name, email,phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {

    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   
    const newUser = new Users({
      name: name,
      email: email,
      phone:phone,
      password: hashedPassword,
    });

     await newUser.save();

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.login = async (req, res) => {
  //Step 1 : Check if data is coming or not
  console.log(req.body);
 
  //Step 2 : Destructure the data
  const { email, password } = req.body;
 
  //Step 3 : validate the incoming data
  if (!email || !password) {
    return res.json({
      success : false,
      message : "Please enter all fields."
    });
  }
 
  //Step 4 : try catch block
  try {
    //Step 5 : check exisiting user
    const exisitingUser = await Users.findOne({ email: email });
    if (!exisitingUser) {
      return res.json({
        success : false,
        message: "User does not exixts"
      });
    }
 
    //Step 6 : check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      exisitingUser.password
    );
    if (!isPasswordCorrect) {
      return res.json({
        success : false,
        message: "Invalid credentials"
      });
    }

    //  Step 7 : Create token
    const token = await jwt.sign(
      { id: exisitingUser._id, isAdmin:exisitingUser.isAdmin // yesma isadmin ni cchekc garne model ma halepaxi 
    },
      process.env.JWT_SECRET
    );
    //Step 8 : Response
    res.status(200).json({
      success : true,
      message: "User logged in successfully.",
      token: token,
      userData: exisitingUser,
    });
  } catch (error) {
    res.json({
      success : false,
      message: "Server Error",
    });
    }
  };

  exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                // phone: user.phone,
                address: user.address,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving user profile', error: error.message });
    }
};
  exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                // address: user.address,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving user profile', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email, 
            phone,
             } = req.body;               

        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            phone,
      
        }, {
        // Return a 200 status with the updated user object
            new: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user profile', error: error.message });
    }

}
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Ensure required fields are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
    }

    // Find the user by ID (assumes middleware sets req.user.id from the JWT)
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the old password is correct
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    // Ensure the new password is not the same as the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the old password' });
    }

    // Hash and set the new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error changing password', error: error.message });
  }
};


