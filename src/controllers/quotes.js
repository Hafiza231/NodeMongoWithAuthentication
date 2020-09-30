import Quotes from '../models/quotes';

export const getAll = async () => {
  try {
    return await Quotes.find();
  } catch (err) {
    throw new Error(`getAll Err: ${err}`);
  }
};

export const getById = async (id) => {
  try {
    const quotes = await getAll();
    return quotes.find((x) => x.id === id);
  } catch (err) {
    throw new Error(`getById Err: ${err}`);
  }
};

export const createQuote = async (data) => {
  try {
    const quotes = await getAll();
    if (quotes.find((x) => x.quote === data.quote)) {
      return false;
    }
    const quote = {
      id: quotes.length ? Math.max(...quotes.map((x) => x.id)) + 1 : 1,
      author: data.author,
      quote: data.quote,
      created: new Date(Date.now()).toISOString(),
      likes: 0,
      createdBy: data.createdBy,
    };
    return await Quotes.create(quote);
  } catch (err) {
    throw new Error(`createOne Err: ${err}`);
  }
};

export const updateQuote = async (quoteId, data) => {
  try {
    const quote = { ...data };
    return await Quotes.findOneAndUpdate({ id: quoteId }, quote, { new: true });
  } catch (err) {
    throw new Error(`updateQuote Err: ${err}`);
  }
};

export const deleteQuote = async (quoteId) => {
  try {
    return await Quotes.findOneAndDelete({ id: quoteId });
  } catch (err) {
    throw new Error(`deleteQuote Err: ${err}`);
  }
};
