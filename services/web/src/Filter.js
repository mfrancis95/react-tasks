import React from 'react';
import PropTypes from 'prop-types';

// This component is the filter button in the top navbar and its associated
// dropdown menu with several filter options. This controls re-querying the
// tasks api server for task ids using the selected filter options.
export default class Filter extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {completed: false, dueToday: false, dueTomorrow: false, overdue: false};
    }
    
    // Prevent the component from constantly querying the tasks api server for
    // the tasks id list by making sure it's only done on state change.
    componentDidUpdate(prevProps, prevState) {
        if (this.state !== prevState) {
            this.props.getTasks(this.state);
        }
    }
    
    // Every time an input field is changed, update the state with the value of
    // that field.
    onChange = event => {
        let state = {};
        state[event.target.id] = event.target.checked;
        this.setState(state);
    }

    render() {
        return (
            <div className="input-group">
                <div className="dropdown input-group-append">
                    <button className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" type="button"> Filter</button>
                    <div className="dropdown-menu px-2">
                        <div className="custom-control custom-checkbox mb-2 pl-0">
                            <input checked={this.state.completed} className="custom-control-input" onChange={this.onChange} id="completed" type="checkbox" />
                            <label className="custom-control-label" htmlFor="completed">Completed</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2 pl-0">
                            <input checked={this.state.dueToday} className="custom-control-input" onChange={this.onChange} id="dueToday" type="checkbox" />
                            <label className="custom-control-label" htmlFor="dueToday">Due Today</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2 pl-0">
                            <input checked={this.state.dueTomorrow} className="custom-control-input" onChange={this.onChange} id="dueTomorrow" type="checkbox" />
                            <label className="custom-control-label" htmlFor="dueTomorrow">Due Tomorrow</label>
                        </div>
                        <div className="custom-control custom-checkbox pl-0">
                            <input checked={this.state.overdue} className="custom-control-input" onChange={this.onChange} id="overdue" type="checkbox" />
                            <label className="custom-control-label" htmlFor="overdue">Overdue</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Filter.propTypes = {
    getTasks: PropTypes.func
};