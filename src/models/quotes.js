import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false);

const QuotesSchema = new mongoose.Schema({
  id: String,
  author: String,
  quote: String,
  created: String,
  likes: Number,
  createdBy: String,
});

// eslint-disable-next-line new-cap
const Quote = new mongoose.model('quotes', QuotesSchema);

export default Quote;
