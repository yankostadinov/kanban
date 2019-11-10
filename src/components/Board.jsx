import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Board.css';
import Lane from './Lane.jsx';
import FullScreenModal from './FullScreenModal.jsx';
import TaskModal from './TaskModal.jsx';

const Board = () => {
	const [adding, setAdding] = useState(false);
	const [showHidden, setShowHidden] = useState(false);
	const [lanes, setLanes] = useState([]);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const fetchData = async() => {
			const tasksResponse = await Axios.get('http://localhost:3000/tasks');
			const lanesResponse = await Axios.get('http://localhost:3000/lanes');

			setLanes(lanesResponse.data);
			setTasks(tasksResponse.data);
		};

		fetchData();
	}, []);

	const addLane = async() => {
		const newLane = { title: 'New Lane', order: lanes.length + 1 };
		const laneResponse = await Axios.post('http://localhost:3000/lanes', newLane);

		setLanes(lanes.concat(laneResponse.data));
	};

	const addTask = async({ date = Date.now(), lane, subject, assignee } = {}) => {
		const newTask = { date, lane, subject, assignee };
		const taskResponse = await Axios.post('http://localhost:3000/tasks', newTask);

		setTasks(tasks.concat(taskResponse.data));
		setAdding(false);
	};

	const onLaneDrop = (fromId, toId) => {
		const updatedLanes = lanes.slice();
		const fromLane = updatedLanes.find(lane => lane.id === fromId);
		const toLane = updatedLanes.find(lane => lane.id === toId);

		[fromLane.order, toLane.order] = [toLane.order, fromLane.order];

		Axios.all([Axios.put(`http://localhost:3000/lanes/${fromLane.id}`, fromLane), Axios.put(`http://localhost:3000/lanes/${toLane.id}`, toLane)]);
		setLanes(updatedLanes);
	};

	const onTaskDrop = (taskId, newLaneId) => {
		const updatedTasks = tasks.slice();
		const taskToMove = updatedTasks.find(task => task.id === taskId);

		taskToMove.lane = newLaneId;

		Axios.put(`http://localhost:3000/tasks/${taskToMove.id}`, taskToMove);
		setTasks(updatedTasks);
	};

	const toggleLane = laneId => {
		const updatedLanes = lanes.slice();
		const laneToToggle = updatedLanes.find(lane => lane.id === laneId);
		laneToToggle.hidden = !laneToToggle.hidden;

		Axios.put(`http://localhost:3000/lanes/${laneId}`, laneToToggle);
		setLanes(updatedLanes);
	};

	const onLaneEdit = (laneId, newTitle) => {
		if (!newTitle) return;

		const updatedLanes = lanes.slice();
		const renamedLane = updatedLanes.find(lane => lane.id === laneId);
		renamedLane.title = newTitle;

		Axios.put(`http://localhost:3000/lanes/${laneId}`, renamedLane);
		setLanes(updatedLanes);
	};

	const laneComponents = lanes
		.filter(lane => showHidden || !lane.hidden)
		.sort((lane1, lane2) => lane1.order - lane2.order)
		.map(lane => {
			const laneTasks = tasks.filter(task => task.lane === lane.id);
			return <Lane key={lane.id} id={lane.id} title={lane.title} tasks={laneTasks} onLaneDrop={onLaneDrop} onTaskDrop={onTaskDrop} onToggle={toggleLane} onEdit={onLaneEdit} />;
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
