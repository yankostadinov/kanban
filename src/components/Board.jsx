import React, { useState, useEffect } from 'react';
import './Board.css';
import Lane from './Lane.jsx';
import FullScreenModal from './FullScreenModal.jsx';
import TaskModal from './TaskModal.jsx';
import laneService from '../services/lanes';
import taskService from '../services/tasks';

const Board = () => {
	const [adding, setAdding] = useState(false);
	const [showHidden, setShowHidden] = useState(false);
	const [lanes, setLanes] = useState([]);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const fetchData = async() => {
			const allTasks = await taskService.getAll();
			const allLanes = await laneService.getAll();

			setLanes(allLanes);
			setTasks(allTasks);
		};

		fetchData();
	}, []);

	const addLane = async() => {
		const laneData = { title: 'New Lane', order: lanes.length + 1 };
		const newLane = await laneService.create(laneData);

		setLanes(lanes.concat(newLane));
	};

	const addTask = async({ lane, subject, assignee } = {}) => {
		const taskData = { lane, subject, assignee };
		const newTask = await taskService.create(taskData);

		setTasks(tasks.concat(newTask));
		setAdding(false);
	};

	const onLaneDrop = (fromId, toId) => {
		const updatedLanes = lanes.slice();
		const fromLane = updatedLanes.find(lane => lane.id === fromId);
		const toLane = updatedLanes.find(lane => lane.id === toId);

		[fromLane.order, toLane.order] = [toLane.order, fromLane.order];

		Promise.all([laneService.update(fromLane.id, fromLane), laneService.update(toLane.id, toLane)]);
		setLanes(updatedLanes);
	};

	const onTaskDrop = (taskId, newLaneId) => {
		const updatedTasks = tasks.slice();
		const taskToMove = updatedTasks.find(task => task.id === taskId);

		taskToMove.lane = newLaneId;
		taskService.update(taskToMove.id, taskToMove);

		setTasks(updatedTasks);
	};

	const toggleLane = laneId => {
		const updatedLanes = lanes.slice();
		const laneToToggle = updatedLanes.find(lane => lane.id === laneId);

		laneToToggle.hidden = !laneToToggle.hidden;
		laneService.update(laneId, laneToToggle);

		setLanes(updatedLanes);
	};

	const onLaneEdit = (laneId, newTitle) => {
		if (!newTitle) return;

		const updatedLanes = lanes.slice();
		const renamedLane = updatedLanes.find(lane => lane.id === laneId);

		renamedLane.title = newTitle;
		laneService.update(laneId, renamedLane);

		setLanes(updatedLanes);
	};

	const laneComponents = lanes
		.filter(lane => showHidden || !lane.hidden)
		.sort((lane1, lane2) => lane1.order - lane2.order)
		.map(lane => {
			const laneTasks = tasks.filter(task => task.lane === lane.id);
			return <Lane key={lane.id} id={lane.id} title={lane.title} tasks={laneTasks} hidden={lane.hidden} onLaneDrop={onLaneDrop} onTaskDrop={onTaskDrop} onToggle={toggleLane} onEdit={onLaneEdit} />;
		});

	return (
		<div id="board">
			{adding &&
				<FullScreenModal onClose={() => setAdding(false)}>
					<TaskModal onSubmit={addTask} onCancel={() => setAdding(false)} lanes={lanes} />
				</FullScreenModal>}
			<div className="buttons">
				<button onClick={() => setAdding(true)}>Add task</button>
				<button onClick={addLane}>Add lane</button>
				<button onClick={() => setShowHidden(!showHidden)}>{showHidden ? 'Hide' : 'Show'} hidden lanes</button>
			</div>
			<div className="lanes">{laneComponents}</div>
		</div>
	);
};

Board.displayName = 'Board';

export default Board;
