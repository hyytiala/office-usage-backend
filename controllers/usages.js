const usagesRouter = require('express').Router()
const Usage = require('../models/usage')
const Group = require('../models/group')

Date.prototype.getWeekNumber = function(){
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}

usagesRouter.get('/', async (req, res) => {
    const usages = await Usage.find({}).populate('group', { _id: 1, name: 1 })
    res.json(usages.map(Usage.format))
})

usagesRouter.get('/total', async (req, res) => {
    const usages = await Usage.find({}).populate('group', { _id: 1, name: 1 })
    const under = usages.map(a => a.over).reduce((a, b) => a + b, 0)
    const over = usages.map(a => a.under).reduce((a, b) => a + b, 0)
    const other = usages.map(a => a.other).reduce((a, b) => a + b, 0)
    const sums = {
        under,
        over,
        other
    }
    res.json(sums)
})

usagesRouter.post('/', async (req, res) => {
    try {
        const body = req.body
        if (body.group.length === 0) {
            return res.status(400).json({error: 'No group selected'})
        }
        const date = new Date()
        const usage = new Usage({
            date: date,
            group: body.group,
            under: body.under,
            over: body.over,
            other: body.other,
        })
        const savedUsage = await usage.save()
        const week = date.getWeekNumber()
        await Group.findByIdAndUpdate(body.group, {latest: week}, { new: true })

        res.json(Usage.format(savedUsage))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({error: 'something went wrong...'})
    }
})

module.exports = usagesRouter