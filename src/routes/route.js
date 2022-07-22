const express=require('express')
const router=express.Router()
const transcationController=require("../controller/transactionController")

router.get('/transaction/:address',transcationController.Gettranscation);
router.post('/register_address',transcationController.registerTransaction);

router.get("/ethereum",transcationController.ethereum)
router.post("/add",transcationController.registerCurrency)
router.get("/ethreumPrice",transcationController.EthereumPrice)

router.get("/userDetails/:address",transcationController.getUserDetails)
router.get("/deals/:address1/:address2",transcationController.dealing)
   

module.exports=router;