import express from 'express'

const server = express()
const port = 5000;


server.get('/',(req,res)=>{
    res.send("welcome from the 1st api")
})
server.get('/grp1',(req,res)=>{
    res.send("welcome from the 1st api from grp1")
})


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})