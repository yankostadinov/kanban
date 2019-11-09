import React from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';

const TaskModal = ({ onSubmit, lanes }) => {
	const submitHandler = event => {
		event.preventDefault();
		onSubmit({
			subject: event.target.subject.value || event.target.subject.placeholder,
			assignee: event.target.assignee.value || event.target.assignee.placeholder,
			lane: parseInt(event.target.lane.value) });
	};

	return (
		<form className="task-modal" onSubmit={submitHandler}>
			<span>Subject:<input type="text" name="subject" id="subject" placeholder="Untitled Task" /></span>
			<span>Assignee:<input type="text" name="assignee" id="assignee" placeholder="Yan Kostadinov" /></span>
			<select name="lane" id="lane">
				{lanes.map(lane => <option value={lane.id} key={lane.id}>{lane.title}</option>)}
			</select>
			<input type="submit" value="Create task"/>
		</form>
	);
};

TaskModal.displayName = 'TaskModal';
TaskModal.propTypes = {
	children: PropTypes.node,
	lanes: PropTypes.arrayOf(PropTypes.object),
	onSubmit: PropTypes.func,
};

export default TaskModal;
