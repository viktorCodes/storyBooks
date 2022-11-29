
const mongoose = require('mongoose')

const PrivatejournalSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
   status: {
        type: String,
        default: 'private',
        enum: ['private', 'public'],
    },
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Privatejournal', PrivatejournalSchema)