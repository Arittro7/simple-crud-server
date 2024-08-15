const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())

// mongodb User Name and Password for now 
// sonytv0821 XP6EGR666nbkskT2

const uri = "mongodb+srv://sonytv0821:XP6EGR666nbkskT2@cluster0.wv413.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // 55_3 @11m Connect with mongodb start
    const database = client.db("usersDB");
    const userCollection = database.collection("users"); 
    // 55_3 @11m Connect with mongodb end

    app.get('/users', async(req, res) =>{
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
     // 55_7 Update user Start
     app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await userCollection.findOne(query)
      res.send(user)
    })
    // 55_7 Update user End

    // 55_3 @3m connect with client side start
    app.post('/users', async(req, res) =>{
      const user = req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user); //11m
      res.send(result) //11m
    });
    // 55_3 @3m connect with client side end

    // 55_5 Delete user @7m start
    app.delete('/users/:id', async(req , res) =>{
      const id = req.params.id;
      console.log('Please delete from database', id);
      const query = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
    // 55_5 Delete user @7m end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Simple CRUD is Running')
})

app.listen(port, () => {
  console.log(`simple curd is running on port ${port}`)
})