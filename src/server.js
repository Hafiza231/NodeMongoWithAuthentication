import app from './app';
import DB from './utils/db_conn';

const start = async () => {
  await DB();
  const port = 1234;

  app.listen(port,() => {
    // eslint-disable-next-line no-console
    console.log(`server start on port ${port}`);
  });
};

(async () => {
  await start();
})();
