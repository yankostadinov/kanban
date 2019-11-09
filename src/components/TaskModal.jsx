import React from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';

const TaskModal = ({ onSubmit, lanes }) => (
	<form className="task-modal" onSubmit={onSubmit}>
		<span>Subject:<input type="text" name="subject" id="subject"/></span>
		<span>Assignee:<input type="text" name="assignee" id="assignee"/></span>
		<select name="lane" id="lane">
			{lanes.map(lane => <option value={lane.id} key={lane.id}>{lane.title}</option>)}
		</select>
		<input type="submit" value="Create task"/>
	</form>
);

TaskModal.displayName = 'TaskModal';
TaskModal.propTypes = {
	children: PropTypes.node,
	lanes: PropTypes.arrayOf(PropTypes.object),
	onSubmit: PropTypes.func,
};

export default TaskModal;
