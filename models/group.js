const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: String,
    latest: Number
})

groupSchema.statics.format = (group) => {
    return {
        id: group.id,
        name: group.name,
        latest: group.latest
    }
}

const Group = mongoose.model('Group', groupSchema)

module.exports = Group