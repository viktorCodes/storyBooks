
const mongoose = require('mongoose')

const JournalSchema = new mongoose.Schema({
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
        default: 'public',
        enum: ['public', 'private'],
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

module.exports = mongoose.model('Journal', JournalSchema)