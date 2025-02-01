const router = require('express').Router();
const { authGuard } = require('../middlewares/authGuard'); // JWT auth middleware
const {getUserProfile, updateUserProfile, changePassword,login,create} = require('../controllers/userControllers');

router.post('/create', create);
router.post('/login',login)
router.get('/profile', authGuard, getUserProfile);

router.put('/updateProfile', authGuard, updateUserProfile);


router.put('/change-password', authGuard,changePassword)

module.exports = router;