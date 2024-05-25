# 📝 Checklist API

A modularized Express.js API for managing checklists and templates with MongoDB. This project includes error handling, logging, and performance monitoring.

## 🌟 Features

- Modularized route structure for better maintainability.
- Comprehensive error handling.
- Performance monitoring middleware.
- Logging using Winston.

## 📁 Project Structure

```
project
│   .env
│   package.json
│   server.js
└───config
│       db.js
│       logger.js
└───routes
│       data.js
│       checklists.js
└───middlewares
        errorHandler.js
        performanceMonitor.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm (or yarn)
- MongoDB Atlas account (or a local MongoDB instance)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/checklist-api.git
    cd checklist-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB connection details:
    ```
    USERNAMED=yourUsername
    PASSWORD=yourPassword
    CLUSTER=yourCluster
    OPTIONS=yourOptions
    PORT=3001
    ```

4. Start the server:
    ```sh
    npm start
    ```

## 🔌 API Endpoints

### Templates

- **GET** `/data` - Retrieve all templates
- **POST** `/data` - Create a new template
- **PUT** `/data/:id` - Update a template by ID
- **DELETE** `/data/:id` - Delete a template by ID

### Checklists

- **GET** `/checklists` - Retrieve all checklists
- **GET** `/checklists/:id` - Retrieve a checklist by ID
- **POST** `/checklists` - Create a new checklist
- **PUT** `/checklists/:id` - Update a checklist by ID
- **DELETE** `/checklists/:id` - Delete a checklist by ID

## 🛠️ Configuration

- **Database Configuration**: Handled in `config/db.js`.
- **Error Handling Middleware**: Implemented in `middlewares/errorHandler.js`.
- **Performance Monitoring Middleware**: Implemented in `middlewares/performanceMonitor.js`.
- **Logging Configuration**: Set up in `config/logger.js`.

## 📜 Middleware

### Error Handler

Handles any errors that occur during the request-response cycle.

```javascript
// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
}

module.exports = errorHandler;
```

### Performance Monitor

Logs the duration of each request.

```javascript
// middlewares/performanceMonitor.js
const performanceMonitor = (req, res, next) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    console.log(`${req.method} ${req.url} [${res.statusCode}] - ${elapsedTimeInMs}ms`);
  });

  next();
};

module.exports = performanceMonitor;
```

## 📝 Logging

Configured using Winston for comprehensive logging.

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.

## 💬 Contact

For any inquiries, please reach out at [djayashanka750@gmail.com].

