const express=require("express")
const mongoose=require('mongoose')
const app=express()
const route=require('./routes/route')

app.use(express.json())

app.use('/',route)


let url="mongodb+srv://rubygupta7505:GDDYMfHDEGehjUj0@cluster0.xf64f.mongodb.net/Knoix";

mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err))


app.listen(3000,()=>{
    console.log('running on port 3000')
})

