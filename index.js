const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()



const app = express()
const port =process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfsyp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

const ObjectId = require('mongodb').ObjectId;



async function run(){
    await client.connect();
    const database = client.db('tourism');
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('orders');
    const cartCollection = database.collection('cart');
    try{
        
        app.get('/services', async (req,res) =>{

            const query = {};
            const cursor =  servicesCollection.find(query);
            services = await cursor.toArray()
            
            res.json(services);
            
          })
          app.post('/services', async  (req, res) =>{
            const data = req.body;
            const result = await servicesCollection.insertOne(data);
            console.log("posted", data)
            res.json(result);
        })
       
        app.post('/orders', async (req,res) =>{
      
          const order= req.body;
          
          // console.log("hitting orders")
          const result = await ordersCollection.insertOne(order)
          res.json(result)
    
        })

        app.get('/orders/manageall', async (req,res) =>{

          const query = {};
          const cursor =  ordersCollection.find(query);
          allorders = await cursor.toArray()
          
          res.json(allorders);
          
        })










          app.delete('/order/delete/:id', async (req,res)=>{
            const id = req.params.id
           
            const query = {_id:ObjectId(id)}
            console.log(query)
            const result = await ordersCollection.deleteOne(query);
           
            res.json(result)

        })
        app.put('/status/:id', async (req,res)=>{
          console.log('hitting post')
            const id = req.params.id
            const data = req.body;
            console.log(data)

            const query = {_id:ObjectId(id)}
            // const options = { upsert: true };

             const updateDoc = {
                $set: {
                   status:data.isStatus
          },
            };
            const result = await ordersCollection.updateOne(query, updateDoc);
                    // console.log("delete")
                    res.json(result)
        
                }
                )



    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server running')
  })
  
  app.listen(port, () => {
    console.log("listening to port", port)
  })