const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        const emailCheck = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (usernameCheck) {
            return res.json({ msg: 'Username already used', status: false });
        }

        if (emailCheck) {
            return res.json({ msg: 'Email already used', status: false });
        }

        // Create and save
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ msg: 'Incorrect email or password', status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ msg: 'Incorrect email or password', status: false });
        }

        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        console.log('userId :', userId);
        console.log('avatarImage :', avatarImage);
        const userData = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $set: {
                    isAvatarImageSet: true,
                    avatarImage,
                },
            },
            { new: true },
        );
        console.log('userData :', userData);
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            'email',
            'username',
            'avatarImage',
            '_id',
        ]);

        return res.json(users);
    } catch (error) {
        next(error);
    }
};
