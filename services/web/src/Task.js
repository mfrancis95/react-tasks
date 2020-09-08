import React from 'react';
import PropTypes from 'prop-types';

const TASKS_API = `${process.env.REACT_APP_TASKS_API_HOST}:${process.env.REACT_APP_TASKS_API_PORT}/api/v1`;

// The Task component is a visual representation of a task from the database. It
// features a checkbox control that persists the state of the checkbox over to
// the task's "completed" field in the database.
export default class Task extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {completed: false};
    }
    
    // On initial load of the component, pull full information about the task
    // from the database.
    componentDidMount() {
        this.getTask();
    }
    
    // When the delete button is clicked, delegate to the App component's
    // function for deleting a task, passing in the id.
    deleteTask = () => this.props.deleteTask(this.props._id);
    
    // Query the database for full information (name, description, dueDate) of
    // a task so the fields can be displayed.
    getTask = async () => {
        const data = await fetch(`${TASKS_API}/task/${this.props._id}`)
            .then(response => response.json());
        if (data.success) {
            let dueDate = new Date(data.task.dueDate);
            dueDate.setMinutes(dueDate.getMinutes() + new Date().getTimezoneOffset());
            this.setState({
                completed: data.task.completed,
                description: data.task.description,
                dueDate: dueDate,
                name: data.task.name
            });
        }
    }
    
    // Handler for the completed checkbox, which updates the task's completed
    // field in the database.
    complete = async () => {
        const data = await fetch(`${TASKS_API}/task/${this.props._id}`, {
            body: JSON.stringify({completed: true}),
            headers: {'Content-Type': 'application/json'}, method: 'POST'
        }).then(response => response.json());
        if (data.success) {
            this.setState({completed: true});
        }
    }

    render() {
        let due = null;
        if (this.state.dueDate) {
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(23, 59, 59, 999);
            if (this.state.dueDate < today) {
                // Only show "Overdue" if the task wasn't completed.
                if (!this.state.completed) {
                    due = (<span className="badge badge-danger">Overdue</span>);
                }
            }
            else if (this.state.dueDate.getTime() === today.getTime()) {
                due = (<span className="badge badge-warning">Due Today</span>);
            }
            else if (this.state.dueDate < tomorrow) {
                due =(<span className="badge badge-info">Due Tomorrow</span>);
            }
        }
        let completed = null;
        // If the task was completed, strikeout the "Complete" text.
        if (this.props.completed) {
            completed = (<del>Complete</del>);
        }
        else {
            completed = (<span>Complete</span>);
        }
        let dueDate = this.state.dueDate;
        if (dueDate) {
            dueDate = (<p className="card-text small">Due {`${dueDate.getFullYear()}-${dueDate.getMonth()}-${dueDate.getDate()}`}</p>);
        }
        return (
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-10">
                            <h4>{this.state.name} {due}</h4>
                        </div>
                        <div className="col-2">
                            <button type="button" className="close" aria-label="Close" onClick={this.deleteTask}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text">{this.state.description}</p>
                    {dueDate}
                </div>
                <div className="card-footer">
                    <div className="custom-control custom-checkbox pl-0">
                        <input checked={this.state.completed} className="custom-control-input" disabled={this.state.completed} onChange={this.complete} name="completed" id={`completed${this.props._id}`} type="checkbox" />
                        <label className="custom-control-label" htmlFor={`completed${this.props._id}`}>{completed}</label>
                    </div>
                </div>
            </div>
        );
    }
}

Task.propTypes = {
    completed: PropTypes.func,
    deleteTask: PropTypes.func,
    _id: PropTypes.string
};