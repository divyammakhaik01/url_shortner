const db = require('../config/db')
const mongoose = require("mongoose")

const Schema = mongoose.Schema;

    
const url_schema = new Schema({

    original_url : {
        type : String,
        require : true
    } , 

    short_url : {
        type : String , 
        require:true
    }
    
    
} , {timestamps : true})


module.exports = mongoose.model('shortURL' , url_schema);