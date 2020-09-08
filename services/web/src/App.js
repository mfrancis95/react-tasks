import React from 'react';
import Filter from './Filter';
import Task from './Task';
import CreateTask from './CreateTask';

const TASKS_API = `${process.env.REACT_APP_TASKS_API_HOST}:${process.env.REACT_APP_TASKS_API_PORT}/api/v1`;

// This is the main application component that manages all the task instances
// on screen.
export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {tasks: []};
    }
    
    componentDidMount() {
        this.getTasks();
    }
    
    // Retrieve information about a task by id from the tasks api server and add
    // it to the front of the tasks list.
    addTask = async (_id) => {
        const data = await fetch(`${TASKS_API}/task/${_id}`)
            .then(response => response.json());
        if (data.success) {
            let tasks = this.state.tasks;
            tasks.unshift(data.task);
            this.setState({tasks: tasks});
        }
    }
    
    // Send a request to the tasks api server to delete a task by id, then
    // remove it from the internal client-side list.
    deleteTask = async (_id) => {
        const data = await fetch(`${TASKS_API}/task/${_id}`, {method: 'DELETE'})
            .then(response => response.json());
        if (data.success) {
            let tasks = this.state.tasks;
            tasks.splice(tasks.findIndex(task => task._id === _id), 1);
            this.setState({tasks: tasks});
        }
    }
    
    // Retrieve a list of task ids from the tasks api server, passing in
    // optional filters taken from the Filter component.
    getTasks = async (filters = {}) => {
        let route = `${TASKS_API}/tasks?`;
        if (filters.completed) {
            route += 'completed=true&'
        }
        if (filters.dueToday) {
            route += 'dueToday=true&'
        }
        if (filters.dueTomorrow) {
            route += 'dueTomorrow=true&';
        }
        if (filters.overdue) {
            route += 'overdue=true';
        }
        const data = await fetch(route).then(response => response.json());
        if (data.success) {
            this.setState({tasks: data.tasks});
        }
    }
    
    render() {
        const tasks = this.state.tasks.map(task => {
            return <Task _id={task._id} deleteTask={this.deleteTask} key={task._id} />
        });
        return (
            <div>
                <nav className="bg-primary navbar navbar-dark navbar-expand-lg sticky-top">
                    <div className="container">
                        <a className="navbar-brand" href="/">Tasks</a>
                        <div className="collapse navbar-collapse" id="collapse">
                            <ul className="navbar-nav">
                                <li>
                                    <a className="nav-link" data-toggle="modal" data-target="#modal" href="#">Create Task</a>
                                </li>
                            </ul>
                            <Filter getTasks={this.getTasks} />
                        </div>
                  </div>
                </nav>
                <div className="container mt-4" id="root">
                    <div className="card-columns">
                        {tasks}
                    </div>
                    <CreateTask addTask={this.addTask} getTasks={this.getTasks} show={this.state.showModal} />
                </div>
            </div>
        );
    }
}