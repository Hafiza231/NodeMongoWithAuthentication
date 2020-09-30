import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Logger from '../utils/logger';

const logger = new Logger('Controller', 'user.js');

export const createOne = async (data) => {
  try {
    await User.create(data);
  } catch (err) {
    throw new Error(`create Err: ${err}`);
  }
};

export const findByUsername = async (username) => {
  try {
    return await User.findOne(username);
  } catch (err) {
    throw new Error(`findByUsername Err: ${err}`);
  }
};

export const getById = async (userId) => {
  try {
    return await User.findOne({ id: userId });
  } catch (err) {
    throw new Error(`getById Err: ${err}`);
  }
};

export const getAllUser = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw new Error(`getAllUser Err: ${err}`);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const quote = { ...data };
    return await User.findOneAndUpdate({ id: userId }, quote, { new: true });
  } catch (err) {
    throw new Error(`updateUser Err: ${err}`);
  }
};

export const deleteUser = async (userId) => {
  try {
    return await User.findOneAndDelete({ id: userId });
  } catch (err) {
    throw new Error(`deleteUser Err: ${err}`);
  }
};

export const register = async (body) => {
  const data = { ...body };
  data.password = await bcrypt.hashSync(data.password, 10);
  const users = await getAllUser();
  data.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
  await createOne(data);
};

export const login = async (body) => {
  const data = { ...body };
  try {
    logger.info(data.username, data.password);
    const user = await findByUsername({ username: data.username });
    const isAuth = await bcrypt.compareSync(data.password, user.password);
    if (isAuth) {
      return jwt.sign({ id: user.id }, 'serverSecretKey');
    }
    return false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
