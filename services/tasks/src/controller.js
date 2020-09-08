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
    const result = await tasks.insertOne(matchedData(request));
    response.json({_id: result.insertedId, success: true});
};

exports.deleteTask = async (request, response) => {
    const result = await tasks.removeOne({_id: request.params._id});
    response.json({success: true});
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
    response.json({success: true, tasks: await tasks.find(filters, {_id: true}).toArray()});
};

exports.updateTask = async (request, response) => {
    const result = await tasks.updateOne(
        {_id: new MongoClient.ObjectID(request.params._id)},
        {$set: {completed: request.body.completed}});
    response.json({success: true});
}
