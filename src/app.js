import jwt from 'jsonwebtoken';
import Express from 'express';
import bcrypt from 'bcrypt';
import userRouter from './routes/user';
import quotesRouter from './routes/quotes';
import { register, login, findByUsername } from './controllers/user';

const app = new Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const tokenMiddleware = (req, res, next) => {
  const token = req.headers && req.headers.authorization;
  if (token) {
    const decodedJWTData = jwt.verify(token.split(' ')[1], 'serverSecretKey');
    req.user = decodedJWTData;
    next();
  } else {
    res.status(401).send({ message: 'unauthorized access' });
  }
};

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pass to next layer of middleware
  return next();
});

app.use('/quotes', tokenMiddleware, quotesRouter);

app.post('/users/authenticate', async (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(401).send({ message: 'Username and Password are required' });
  }
  const token1 = await login(req.body);
  if (token1) {
    const data = await findByUsername({ username: req.body.username });
    if (data.username === 'admin' && await bcrypt.compareSync('admin123', data.password)) {
      const admin = {
        id: data.id,
        username: data.username,
        firstname: data.firstName,
        lastname: data.lastName,
        token: token1,
        role: 'Admin',
      };
      res.header('Authorization', `Bearer ${token1}`).json(admin);
    } else {
      const user = {
        id: data.id,
        username: data.username,
        firstname: data.firstName,
        lastname: data.lastName,
        token: token1,
        role: '',
      };
      res.header('Authorization', `Bearer ${token1}`).json(user);
    }
    return;
  }
  res.status(400).send({ message: 'Username or password is incorrect' });
});

app.post('/users/register', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.username && !data.password) {
      res.status(401).send({ message: 'Username and Password are required' });
      return;
    }
    const user = await findByUsername({ username: data.username });
    if (!user) {
      await register(req.body);
      res.json({ status: 'ok' });
    }
    res.status(400).send({ message: `Username "${data.username}" is already taken` });
  } catch (err) {
    res.status(400).end({ message: err });
  }
});

app.use('/users', tokenMiddleware, userRouter);

export default app;
