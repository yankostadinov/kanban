import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Lane.css';
import Task from './Task.jsx';
import EditableText from './EditableText.jsx';

const Lane = ({ tasks, id, title, onLaneDrop, onTaskDrop, onToggle, onEdit, hidden }) => {
	const [dragging, setDragging] = useState(false);
	const [dropping, setDropping] = useState(false);
	const titleRef = createRef();

	const onDragStart = event => {
		if (event.target !== titleRef.current) return;

		event.dataTransfer.setData('text/lane-id', id);
		setDragging(true);
	};
	const onDragOver = event => {
		if (!event.dataTransfer.types.includes('text/lane-id') && !event.dataTransfer.types.includes('text/task-id')) return;

		event.preventDefault();
		setDropping(true);
	};
	const onDragLeave = () => setDropping(false);
	const onDragEnd = () => setDragging(false);
	const onDrop = event => {
		event.preventDefault();
		setDropping(false);

		const laneId = parseInt(event.dataTransfer.getData('text/lane-id'));
		const taskId = parseInt(event.dataTransfer.getData('text/task-id'));

		if (laneId) onLaneDrop(laneId, id);
		if (taskId) onTaskDrop(taskId, id);
	};

	const toggleHandler = () => onToggle(id);
	const editHandler = newTitle => onEdit(id, newTitle);

	const hiddenClass = hidden ? 'hidden' : '';
	const draggingClass = dragging ? 'dragging' : '';
	const droppingClass = !dragging && dropping ? 'dropping' : '';
	const classes = `lane ${hiddenClass} ${draggingClass} ${droppingClass}`;

	return (
		<div className={classes} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
			<div className="title" ref={titleRef} draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd}>
				<EditableText value={title} onToggle={toggleHandler} toggled={!hidden} onEdit={editHandler} />
			</div>
			<div className="tasks">{tasks.map(task =>
				<Task subject={task.subject} key={task.id} id={task.id} assignee={task.assignee} />
			)}</div>
		</div>
	);
};

Lane.displayName = 'Lane';
Lane.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	onLaneDrop: PropTypes.func.isRequired,
	onTaskDrop: PropTypes.func.isRequired,
	onToggle: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	tasks: PropTypes.arrayOf(Task).isRequired,
};

export default Lane;
