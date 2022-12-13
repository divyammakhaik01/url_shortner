const express = require('express')
const shortid = require('shortid')
const db = require('./config/db');
const shortURL = require('./model/url')
const path = require('path')

const app = express();

const PORT = process.env.PORT ||  8080;

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


// template

app.set('views' ,path.join(__dirname , '/views'))
app.set('view engine' , 'ejs')


// routes


app.get('/', (req,res)=>{
    res.render('index');
})

app.post('/get' , async(req,res)=>{
    try {
        const {url} = req.body;
        console.log(url);
        if(!url){
            return res.json({
                "status" : "false",
                "message" :"url not entered"
            })
        }

        const url_exist = await shortURL.find({original_url : url})

        console.log("url_exist " , url_exist);

        
        if(url_exist.length > 0){
            return res.json({
                "status" : "true" , 
                "message" : url_exist[0].short_url
            })
            //  res.render('home' , {short_url : url_exist.short_url})
        }else{
            let data = await shortURL.create({
                original_url : url , 
                short_url : `http://localhost:8080/${shortid.generate()}`
            })

            console.log(data);
            
            return res.json({
                "status" : "true" , 
                "message" : data.short_url
            })
            // res.render('home' , {short_url : data.short_url});
        }

        
        
    } catch (error) {
        res.json({
            "status" : "true" , 
            "message" : error
        })
    }


})

app.get('/:id' , async(req,res)=>{
    try {
        const {id} = req.params;
        console.log(id);
        let short_url = `http://localhost:8080/${id}`;
        const url_exist = await shortURL.findOne({short_url});
        console.log("url_exist " ,url_exist );
        if(!url_exist){
            return res.join({
                "status" :"false",
                "message" :"url not found in database"
            })
        }
        return res.redirect(url_exist.original_url)
        
        // res.render('home' , {original_url : url_exist.original_url});
        
    } catch (error) {
        return res.json({
            "status" :"false",
            "message" : error
        })
    }
})


// app.use('/' , (req , res) => {
//     return res.json({
//         "status" : "true"
//     })
// })



app.listen(PORT , ()=>{
    console.log("app running....");
    db();
})