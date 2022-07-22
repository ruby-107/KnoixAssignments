const axios=require('axios');
const transactionModel = require("../models/transactionModel")
const currencyModel=require("../models/currencyModel")


//task1===>
//1. Develop an API  fetch the crypto transactions of a user using address..

const Gettranscation=async(req,res)=>{
    try {
        let options = {
            method: 'get',
            url: `https://api.etherscan.io/api?module=account&action=balance&address=${req.params.address}&tag=latest&apikey=4IZZ6QQHP2MFS7V8JVY4PC2JW8KCG5W2XU`
        }
        let result = await axios(options);
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//task 1===>
//2==> transaction post api and store the database 

const registerTransaction=async(req,res)=>{
    try{
        if(!req.body.address || !req.body.transaction)
        return res.status(400).send({msg:'please provide address and transaction'})

        let data=await transactionModel.create(req.body)
        return res.status(201).send({msg:"successfully added",result:data})

    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//task3===>
//3. fetch the price of Ethereum and store in database in mongodb

const ethereum=async(req,res)=>{
    try {
        let options = {
            method: 'get',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`
        }
        let result = await axios(options);
        let data = result.data

       let value=data.ethereum.inr;

       let obj={};

       obj['ethereum.inr']=value;

       await currencyModel.findOneAndUpdate({_id:"62da52a46704bb5bfe81db2e"},obj)

        res.status(200).send({ msg: data, status: true })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//task2==>
//04 adding the currency in database


const registerCurrency=async(req,res)=>{
    try{
          let data=req.body
          let ans=await currencyModel.create(data)
          return res.status(201).send(ans)
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//05  fetch the price of Ethereum every 10 everytime


const EthereumPrice=async(req,res)=>{
    try {
        let result = await currencyModel.find();
        res.status(200).send({ data:result})
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//06  `GET` API for a user where they give their address as an input and get their current balance and current price of ether as output.


const getUserDetails=async(req,res)=>{
    try{
    let address=req.params.address
    let found=await transactionModel.findOne({address})
    let balance=found.transaction
    let ethereumPrice=await currencyModel.find()
    let price=ethereumPrice[0].ethereum.inr
    let result={
        userBalance:balance,
        ethreumPrice:price
    }
    return res.status(200).send({msg:"user details fetched",data:result})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}


//07 transaction


const dealing=async(req,res)=>{
    try{
        console.log(req.query.choice)
        /* froms add1 to add2
            take the amount from add1 into a var and make it zero
            add it to add2 transaction
        */
      if(req.query.choice==="from"){
             let user1=await transactionModel.findOne({address:req.params.address1})
             let user1Money=user1.transaction;  //money froim add2
            
             let user2=await transactionModel.findOne({address:req.params.address2})
             let user2Money=user2.transaction

           let update1={};
           let update2={} ;

          update2["transaction"]=(+user1Money)+(+user2Money)
          update1["transaction"]=0;

           await transactionModel.findOneAndUpdate({address:req.params.address1},update1)
           await transactionModel.findOneAndUpdate({address:req.params.address2},update2)

             let dataa=await transactionModel.findOne({address:req.params.address1})
             return res.status(200).send({data:dataa})
       }else if (req.query.choice==="to"){ 
               
                     // to add1 from addr2
            
           let sender=await transactionModel.findOne({address:req.params.address2})
           let senderMoney=sender.transaction;

           let reciever=await transactionModel.findOne({address:req.params.address1})
           let recieverMoney=reciever.transaction;

           let update1={};let update2={};

           update1["transaction"]=(+senderMoney)+(+recieverMoney)
           update2['transaction']=0;

           await transactionModel.findOneAndUpdate({address:req.params.address1},update1)
           await transactionModel.findOneAndUpdate({address:req.params.address2},update2)

           let dataa=await transactionModel.findOne({address:req.params.address1})
           return res.status(200).send({data:dataa})
       }

    }catch(err){
        return res.status(500).send({msg:err.msg})
    }
}

module.exports={Gettranscation,
                registerTransaction,
                ethereum,
                registerCurrency,
                EthereumPrice,
                getUserDetails,
                dealing
            };

