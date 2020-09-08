const { body } = require('express-validator');
const taskController = require('./controller.js');

const app = require('express')();

app.use(require('body-parser').json());
app.use(require('cors')());

const API = '/api/v1';

// Route for creating a new task.
// POST /api/v1/task
// Body: {
// "name": string (required),
// "description": string (required),
// "dueDate": date string in YYYY-MM-DD format (required)
// }
// Returns: {
// "success": boolean,
// "_id": string id of created task
// }
app.post(
    `${API}/task`,
    [body('name'), body('description'), body('dueDate').toDate()],
    taskController.createTask);

// Route for updating a task property.
// POST /api/v1/task/:_id
// Route params: {
// "_id": id of task to update (required)
// }
// Body: {
// "completed": boolean (required)
// }
// Returns: {
// "success": boolean
// }
app.post(
    `${API}/task/:_id`, [body('completed').isBoolean()],
    taskController.updateTask);

// Route for deleting a task.
// DELETE /api/v1/task/:_id
// Route params: {
// "_id": id of task to delete (required)
// }
// Returns: {
// "success": boolean
// }
app.delete(`${API}/task/:_id`, taskController.deleteTask);

// Route for retrieving information about a task.
// GET /api/v1/task/:_id
// Route params: {
// "_id": id of task to retrieve (required)
// }
// Returns: {
// "success": boolean,
// "task": {
//     "name": string,
//     "description": string,
//     "dueDate": date string
// }
// }
app.get(`${API}/task/:_id`, taskController.getTask);

// Route for retrieving multiple task ids with optional filters.
// GET /api/v1/tasks
// Query params: {
// "completed": boolean (optional),
// "dueToday": boolean (optional),
// "dueTomorrow": boolean (optional),
// "overdue": boolean (optional)
// }
// Returns: {
// "success": boolean
// }
app.get(`${API}/tasks`, taskController.getTasks);

app.listen(process.env.TASKS_API_PORT, () => {
    console.log(`Started server on port ${process.env.TASKS_API_PORT}.`);
});
