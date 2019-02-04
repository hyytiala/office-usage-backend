const usagesRouter = require('express').Router()
const Usage = require('../models/usage')

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
        const usage = new Usage({
            date: new Date(),
            group: body.group,
            under: body.under,
            over: body.over,
            other: body.other,
        })

        const savedUsage = await usage.save()

        res.json(Usage.format(savedUsage))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({error: 'something went wrong...'})
    }
})

module.exports = usagesRouter