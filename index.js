const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middeleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x1smjlm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // --------------------------------------------------------------------------------------------

    const CoffeeCollection = client.db("CoffeeDB").collection("coffee");
    app.get('/coffee', async (req, res) => {
      const cursor = CoffeeCollection.find();
      const result = await cursor.toArray()

      res.send(result);
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.findOne(query)

      res.send(result)
    })

    app.post('/coffee', async (req, res) => {

      const newCoffee = req.body;
      const result = await CoffeeCollection.insertOne(newCoffee)
      res.send(result)

    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          Name: updatedCoffee.Name,
          Supplier: updatedCoffee.Supplier,
          Category: updatedCoffee.Category,
          Chef: updatedCoffee.Chef,
          Taste: updatedCoffee.Taste,
          Price: updatedCoffee.Price,
          PhotoURL: updatedCoffee.PhotoURL,
        }
      }
      const result = await CoffeeCollection.updateOne(filter, coffee, options)

      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.deleteOne(query)

      res.send(result)
    })


    // --------------------------------------------------------------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Coffee Store Server is Running')
})

app.listen(port, () => {
  console.log(`Coffee Server is Running on PORT: ${port}`);

})