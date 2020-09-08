const { body } = require('express-validator');
const taskController = require('./controller.js');

const app = require('express')();

app.use(require('body-parser').json());
app.use(require('cors')());

const API = '/api/v1';

app.post(
    `${API}/task`,
    [body('name'), body('description'), body('dueDate').toDate()],
    taskController.createTask);

app.post(
    `${API}/task/:_id`, [body('completed').isBoolean()],
    taskController.updateTask);

app.delete(`${API}/task/:_id`, taskController.deleteTask);

app.get(`${API}/task/:_id`, taskController.getTask);

app.get(`${API}/tasks`, taskController.getTasks);

app.listen(process.env.TASKS_API_PORT, () => {
    console.log(`Started server on port ${process.env.TASKS_API_PORT}.`);
});
