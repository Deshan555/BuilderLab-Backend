const { MongoClient, ServerApiVersion } = require('mongodb');
const username = process.env.USERNAMED;
const password = encodeURIComponent(process.env.PASSWORD);
const cluster = process.env.CLUSTER;
const options = process.env.OPTIONS;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${options}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db("checkLists");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = connectDB;
