const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccmxqkh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const taskCollection = client.db("lilliput").collection("posts");
const userCollection = client.db("lilliput").collection("users");

app.get("/posts", async (req, res) => {
  const query = {};
  const cursor = taskCollection.find(query);
  const books = await cursor.toArray();
  res.send(books);
});

app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const books = await taskCollection.findOne(query);
  res.send(books);
});

app.post("/posts", async (req, res) => {
  const newBooks = req.body;
  const result = await taskCollection.insertOne(newBooks);
  res.send(result);
});

// Update bookmark
app.put("/posts/status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedBookmarks = {
      $set: {
        status: "complete",
      },
    };
    const result = await taskCollection.updateOne(
      filter,
      updatedBookmarks,
      options
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});
app.put("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedBookmarks = {
      $set: {
        status: "complete",
      },
    };
    const result = await taskCollection.updateOne(
      filter,
      updatedBookmarks,
      options
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(filter);
  res.send(result);
});

// Users get post delete
app.get("/users", async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const query = { ...user };
  const result = await userCollection.insertOne(query);
  res.send(result);
});

app.get("/userDetails", async (req, res) => {
  const email = req.query.email;
  const query = { email };
  const result = await userCollection.findOne(query);
  res.send(result);
});

app.post("/taskUser", async (req, res) => {
  try {
    const { title, text, email, priority } = req.body;
    const status = "incomplete";
    const body = {
      title,
      text,
      status,
      email,
      priority: Number(priority),
      date: new Date(),
    };
    console.log(body);

    const existingUser = await userCollection.findOne({ email });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(400).json({ message: "user does not exists" });
    }
    const result = await taskCollection.insertOne(body);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

// Home URLs
app.get("/", (req, res) => {
  res.send("Hello from Lilliput");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccmxqkh.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

// async function run() {
//   try {
//     await client.connect();
//     const booksCollection = client.db("sm_soft").collection("books");

//     app.get("/books", async (req, res) => {
//       const query = {};
//       const cursor = booksCollection.find(query);
//       const books = await cursor.toArray();
//       res.send(books);
//     });

//     app.get("/books/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: ObjectId(id) };
//       const books = await booksCollection.findOne(query);
//       res.send(books);
//     });

//     app.post("/books", async (req, res) => {
//       const newBooks = req.body;
//       const result = await booksCollection.insertOne(newBooks);
//       res.send(result);
//     });

//     // Update bookmark
//     app.put("/books/:id", async (req, res) => {
//       const id = req.params.id;
//       console.log(id);
//       const updateBooks = req.body;
//       const filter = { _id: ObjectId(id) };
//       const options = { upsert: true };
//       const updatedBookmarks = {
//         $set: {
//           title: updateBooks.title,
//           tags: updateBooks.tags,
//           link: updateBooks.link,
//         },
//       };
//       const result = await booksCollection.updateOne(
//         filter,
//         updatedBookmarks,
//         options
//       );
//       res.send(result);
//     });

//     app.delete("/books/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: ObjectId(id) };
//       const result = await booksCollection.deleteOne(filter);
//       res.send(result);
//     });
//   } finally {
//   }
// }

// run().catch(console.dir);
