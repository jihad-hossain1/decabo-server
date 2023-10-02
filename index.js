const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8rkw6sl.mongodb.net/?retryWrites=true&w=majority`;

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
        
        const courseCollection = client.db('Decabo').collection('course')

        const serchCollection = client.db('Decabo').collection('course')
        app.get('/getcourseId/:id')

        const indexKeys = { title: 1, category: 1 };
        const indexOptions = { category: "titleCategory" };
        app.get("/getcourseText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await serchCollection
                .find({
                    $or: [
                        { title: { $regex: text, $options: "i" } },
                        { category: { $regex: text, $options: "i" } },
                        { date: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });
        app.get('/courseByEmail', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await courseCollection.find(query).toArray();
            res.send(result)
        })
        app.post("/course", async (req, res) => {
            const doc = req.body;
            const result = await courseCollection.insertOne(doc);
            res.send(result);
        });
        //  collection api
        app.get("/course", async (req, res) => {
            const result = await courseCollection.find().toArray();
            res.send(result);
        });
        // add a 

        // get a single 
        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await courseCollection.findOne(query)
            res.send(result)
        })
        app.get('/course/:email', async (req, res) => {
            const email = req.params.email;
            // const query = { _id: new ObjectId(id) }
            const result = await courseCollection.find(email)
            res.send(result)
        })
        // all geting card delete one by one
        app.delete("/course/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/course/:id', async (req, res) => {
            const id = req.params.id;
            const item = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: item,
            }
            const result = await courseCollection.updateOne(filter, updateDoc, options)
            console.log(result);
            res.send(result)
        })
       
 
        
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('decabo Server is Running');
})

app.listen(port, () => {
    console.log(`decabo Server run on port ${port}`);
})
