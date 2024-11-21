import { Router } from 'express';
import { logoutUser, signupUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile',authenticateToken,getUserProfile);
router.put('/profile',authenticateToken,updateUserProfile);
router.delete('/profile',authenticateToken,deleteUserProfile)
export default router;
