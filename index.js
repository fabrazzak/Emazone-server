const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port =process.env.PORT || 5000;
app=express();

// middleware 
app.use(cors());
app.use(express.json())


// get 
// database1 
// Rm4Hukn7prmO7TI0 

app.get('/',(req,res)=>{

    res.send("Jhon waiting for Ema")

})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e2wlj.mongodb.net/emazone?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
         const productCollection = client.db("emazone").collection("users");
        console.log("DB Connnected");
        app.get('/product',async(req,res)=>{
     
            const page = parseInt(req.query.pages);
            const size = parseInt(req.query.size);
            const query={};
            const cursor= productCollection.find(query);
            let products;
            if(page || size ){
                 products = await cursor.skip(page*size).limit(size).toArray();

            }

            
            res.send(products);

        });
        app.get("/product-count",async(req,res)=>{
            const query={};
            const cursor= productCollection.find(query);
            const count = await productCollection.countDocuments();
            res.send({count});
        })

        app.post('/productByKeys',async(req,res)=>{
            const keys= req.body;
            const ids=keys.map(id =>ObjectId(id))
            const query= {_id: {$in: ids}}
            const cursor =  productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })



    }
    finally{

    }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log("Listening is port ",port);
})