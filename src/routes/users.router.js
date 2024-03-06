import express from 'express';
import * as usersController from '../controllers/usersController.js';
import upload from '../config/multer.config.js';

const router = express.Router();

router.get('/', usersController.getAllUsers);
router.post('/register', usersController.registerUser);
router.put('/premium/:uid', usersController.changeUserRole);
router.post('/:uid/documents', upload.array('documents', 3), usersController.addDocumentToUser);
router.post("/:uid/documents", upload.fields([{ name: "document", maxCount: 3 }, { name: "profileImage", maxCount: 3 }, { name: "productImage", maxCount: 3 }, ]), usersController.addDocumentToUser);

export default router;
