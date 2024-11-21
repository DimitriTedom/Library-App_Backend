import { Router } from 'express';
import { addBook, deleteBook, getBooks, updateBook } from '../controllers/bookController';

const router = Router();

router.get('/',getBooks);
router.post('/',addBook);
router.put('/:id',updateBook)
router.delete('/:id',deleteBook);
export default router;
