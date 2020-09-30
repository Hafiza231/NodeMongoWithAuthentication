import express from 'express';
import bcrypt from 'bcrypt';
import Logger from '../utils/logger';
import {
  getAllUser,
  getById,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = new express.Router();
const logger = new Logger('Routes', 'user.js');

router.get('/', async (req, res) => {
  logger.debug('Get All User');
  try {
    const users = await getAllUser();
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.get('/:id', async (req, res) => {
  logger.debug('Get User by Id');
  try {
    logger.info(req.params.id);
    const user = await getById(req.params.id);
    res.json(user);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.put('/:id', async (req, res) => {
  logger.debug('Update User by Id');
  try {
    logger.info(req.body);
    await updateUser(req.params.id, req.body);
    const quotes = await getAllUser();
    res.status(200).json(quotes);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.delete('/:id', async (req, res) => {
  logger.debug('Delete User by Id');
  try {
    logger.info(req.params.id);
    const user = await getById(req.params.id);
    if (user.username === 'admin' && await bcrypt.compareSync('admin123', user.password)) {
      return res.status(200).send();
    }
    await deleteUser(req.params.id);
    return res.status(200).send();
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ message: err });
  }
});

export default router;
