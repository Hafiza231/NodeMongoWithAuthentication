import dotenv from 'dotenv';

dotenv.config();

const config = {
  dir: process.env.DIR,
  env: process.env.NODE_ENV,
  db: process.env.DB,
};

export default config;
