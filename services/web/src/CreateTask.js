import React from 'react';
import PropTypes from 'prop-types';

const TASKS_API = `${process.env.REACT_APP_TASKS_API_HOST}:${process.env.REACT_APP_TASKS_API_PORT}/api/v1`;

export default class CreateTask extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {task: {}};
    }
    
    onChange = event => {
        let task = this.state.task;
        task[event.target.name] = event.target.value;
        this.setState({task: task});
    }
    
    submit = async () => {
        const data = await fetch(`${TASKS_API}/task`, {
            body: JSON.stringify(this.state.task),
            headers: {'Content-Type': 'application/json'}, method: 'POST'
        }).then(response => response.json());
        if (data.success) {
            document.getElementById('close').click();
            this.props.addTask(data._id);
        }
        else {
            this.setState({errors: data.errors});
        }
    }

    render() {
        let alert = null;
        if (this.state.errors) {
            const error = this.state.errors[0];
            alert = (
                <div className="alert alert-danger" role="alert">
                    {error.msg}: {error.param}
                </div>
            );
        }
        return (
            <div className="modal" id="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Task</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close" type="button">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {alert}
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input className="form-control" name="name" onChange={this.onChange} type="text" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input className="form-control" name="description" onChange={this.onChange} type="text" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dueDate">Due Date</label>
                                    <input className="form-control" name="dueDate" onChange={this.onChange} type="date" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={this.submit} type="button" >Create</button>
                            <button className="btn btn-secondary" data-dismiss="modal" id="close" type="button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateTask.propTypes = {
    addTask: PropTypes.func    
};