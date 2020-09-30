import express from 'express';
import Logger from '../utils/logger';
import {
  getAll,
  createQuote,
  getById,
  updateQuote,
  deleteQuote,
} from '../controllers/quotes';

const router = new express.Router();
const logger = new Logger('Routes', 'quotes.js');

router.get('/', async (req, res) => {
  logger.debug('Get All Quotes');
  try {
    const quotes = await getAll();
    res.json(quotes);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.post('/create', async (req, res) => {
  logger.debug('Create Quote');
  try {
    logger.info(JSON.stringify(req.body, null, 2));
    if (await createQuote(req.body)) {
      res.json({ status: 'ok' });
    } else {
      res.status(400).send({ message: `Quote "${req.body.quote}" is already taken` });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.get('/:id', async (req, res) => {
  logger.debug('Get Quote By Id');
  try {
    logger.info(req.params.id);
    const quote = await getById(req.params.id);
    res.json(quote);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.put('/:id', async (req, res) => {
  logger.debug('Update Quote By Id');
  try {
    logger.info(req.body);
    await updateQuote(req.params.id, req.body);
    const quotes = await getAll();
    res.status(200).json(quotes);
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

router.delete('/:id', async (req, res) => {
  logger.debug('Delete Quote By Id');
  try {
    logger.info(req.params.id);
    await deleteQuote(req.params.id);
    res.status(200).send();
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err });
  }
});

export default router;
