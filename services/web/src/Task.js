import React from 'react';
import PropTypes from 'prop-types';

const TASKS_API = `${process.env.REACT_APP_TASKS_API_HOST}:${process.env.REACT_APP_TASKS_API_PORT}/api/v1`;

export default class Task extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {completed: false};
    }
    
    componentDidMount() {
        this.getTask();
    }
    
    deleteTask = () => this.props.deleteTask(this.props._id);
    
    getTask = async () => {
        const data = await fetch(`${TASKS_API}/task/${this.props._id}`)
            .then(response => response.json());
        if (data.success) {
            this.setState({
                completed: data.task.completed,
                description: data.task.description,
                dueDate: data.task.dueDate,
                name: data.task.name
            });
        }
    }
    
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
        const now = new Date();
        if (this.state.dueDate < now) {
            due = (<span className="badge badge-danger">Past Due</span>);
        }
        let completed = null;
        if (this.props.completed) {
            completed = (<del>Complete</del>);
        }
        else {
            completed = (<span>Complete</span>);
        }
        return (
            <div className="card">
                <div className="card-header row">
                    <div className="col-10">
                        <h4>{this.state.name} {due}</h4>
                    </div>
                    <div className="col-2">
                        <button type="button" className="close" aria-label="Close" onClick={this.deleteTask}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text">{this.state.description}</p>
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