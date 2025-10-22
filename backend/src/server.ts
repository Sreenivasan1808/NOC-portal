import app from './app.js';
import config from './config/config.js';
import db from './db.js';

db.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
