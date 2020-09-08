const MongoClient = require('mongodb');
const { matchedData, validationResult } = require('express-validator');

let tasks;
MongoClient.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`).then(client => {
    tasks = client.db('tasks').collection('tasks');
});

exports.createTask = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(422).json({errors: errors.array(), success: false});
    }
    let task = matchedData(request);
    const result = await tasks.insertOne(task);
    response.json({_id: result.insertedId, success: true});
};

exports.deleteTask = async (request, response) => {
    const result = await tasks.removeOne({
        _id: new MongoClient.ObjectID(request.params._id)});
    response.json({success: result.deletedCount > 0});
};

exports.getTask = async (request, response) => {
    response.json({
        success: true,
        task: await tasks.findOne({_id: new MongoClient.ObjectID(request.params._id)}, {_id: false})});
}

exports.getTasks = async (request, response) => {
    let filters = {};
    if ('completed' in request.query) {
        filters.completed = request.query.completed === 'true';
    }
    let $and = [];
    if ('dueToday' in request.query) {
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let end = new Date();
        end.setHours(23, 59, 59, 999);
        $and.push({dueDate: {$gte: start}});
        $and.push({dueDate: {$lte: end}});
    }
    if ('dueTomorrow' in request.query) {
        let start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        let end = new Date(start);
        end.setHours(23, 59, 59, 999);
        $and.push({dueDate: {$gte: start}});
        $and.push({dueDate: {$lte: end}});
    }
    if ('overdue' in request.query) {
        $and.push({completed: false});
        $and.push({dueDate: {$lt: new Date()}});
    }
    if ($and.length) {
        filters.$and = $and;
    }
    response.json({success: true, tasks: await tasks.find(filters, {_id: true}).toArray()});
};

exports.updateTask = async (request, response) => {
    const result = await tasks.updateOne(
        {_id: new MongoClient.ObjectID(request.params._id)},
        {$set: {completed: request.body.completed}});
    response.json({success: result.modifiedCount > 0});
}
