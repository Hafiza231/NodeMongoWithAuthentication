import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});

// eslint-disable-next-line new-cap
const User = new mongoose.model('users', userSchema);

export default User;
