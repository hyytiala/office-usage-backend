const groupsRouter = require('express').Router()
const Group = require('../models/group')


groupsRouter.get('/', async (req, res) => {
    const groups = await Group.find({})
    res.json(groups.map(Group.format).sort((a,b) => a.name > b.name))
})

groupsRouter.post('/', async (req, res) => {
    try {
        const body = req.body
        if (body.name.length === 0) {
            return res.status(400).json({error: 'empty name'})
        }
        const existingGroup = await Group.find({name: body.name})
        if (existingGroup.length > 0) {
            return res.status(400).json({error: 'Group name already taken'})
        }
        const group = new Group({
            name: body.name,
            latest: 0,
        })

        const savedGroup = await group.save()

        res.json(Group.format(savedGroup))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({error: 'something went wrong...'})
    }
})

groupsRouter.delete('/:id', async (req, res) => {
    try {
        await Group.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch (exception) {
        console.log(exception)
        res.status(400).send({error: 'malformatted id'})
    }
})

module.exports = groupsRouter