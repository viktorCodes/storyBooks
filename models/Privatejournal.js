
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
    type: {
        type: String,
        default: 'food',
        enum: ['health', 'education', 'kids', 'secret', 'work', 'finance', 'electronic', 'relationship' ],
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