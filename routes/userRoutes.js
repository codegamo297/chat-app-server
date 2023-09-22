const { register, login, setAvatar, getAllUsers } = require('../controllers/userController');

const router = require('express').Router();

// Create account
router.post('/register', register);
// Login
router.post('/login', login);
// Set avatar
router.post('/setAvatar/:id', setAvatar);
// Get users
router.get('/allusers/:id', getAllUsers);

module.exports = router;
