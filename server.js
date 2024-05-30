require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const performanceMonitor = require('./src/middlewares/performanceMonitor');
const logger = require('./src/config/logger');

const app = express();
app.use(express.json());
app.use(cors());
app.use(performanceMonitor);
app.use(require('express-status-monitor')())

connectDB().then((db) => {
  app.use('/data', require('./src/routes/data')(db));
  app.use('/checklists', require('./src/routes/checklists')(db));
  app.use('/groups', require('./src/routes/groups')(db));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
