import React from 'react';

const TASKS_API = `${process.env.REACT_APP_TASKS_API_HOST}:${process.env.REACT_APP_TASKS_API_PORT}/api/v1`;

export default class App extends React.Component {
    
    constructor(properties) {
        super(properties);
        this.state = {tasks: []};
    }
    
    componentDidMount() {
        this.getTasks();
    }
    
    addTask = async (_id) => {
        const data = await fetch(`${TASKS_API}/task/${_id}`)
            .then(response => response.json());
        if (data.success) {
            let tasks = this.state.tasks;
            tasks.unshift(data.task);
            this.setState({tasks: tasks});
        }
    }
    
    deleteTask = async (_id) => {
        const data = await fetch(`${TASKS_API}/task/${_id}`, {method: 'DELETE'})
            .then(response => response.json());
        if (data.success) {
            let tasks = this.state.tasks;
            tasks.splice(tasks.findIndex(task => task._id === _id), 1);
        }
    }
    
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
        return (
            <div>
                <nav className="bg-primary navbar navbar-dark navbar-expand-lg sticky-top">
                  <div className="container">
                    <a className="navbar-brand" href="/">Tasks</a>
                  </div>
                </nav>
                <div className="container mt-4" id="root">
                    <div className="card-columns">
                    </div>
                </div>
            </div>
        );
    }
}