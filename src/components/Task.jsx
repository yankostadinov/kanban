import React from 'react';
import PropTypes from 'prop-types';
import './Task.css';

const Task = ({ id, subject = 'Untitled', assignee = 'Unassigned' }) => {
	const onDragStart = event => event.dataTransfer.setData('text/task-id', id);

	return (
		<div className="task" draggable="true" onDragStart={onDragStart}>
			<div className="subject">{subject}</div>
			<div className="assignee">{assignee}</div>
		</div>
	);
};

Task.displayName = 'Task';
Task.propTypes = {
	id: PropTypes.number.isRequired,
	subject: PropTypes.string,
	assignee: PropTypes.string,
};

export default Task;
