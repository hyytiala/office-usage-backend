const mongoose = require('mongoose')

const usageSchema = new mongoose.Schema({
    date: Date,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    under: Number,
    over: Number,
    other: Number
})

usageSchema.statics.format = (usage) => {
    return {
        id: usage.id,
        group: usage.group,
        under: usage.under,
        over: usage.over,
        other: usage.other,
    }
}

const Usage = mongoose.model('Usage', usageSchema)

module.exports = Usage