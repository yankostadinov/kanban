import React, { Component } from 'react';
import Axios from 'axios';
import './Board.css';
import Lane from './Lane.jsx';
import FullScreenModal from './FullScreenModal.jsx';
import TaskModal from './TaskModal.jsx';

class Board extends Component {
	constructor(props) {
		super(props);

		this.state = {
			adding: false,
			lanes: [],
			tasks: [],
		};

		this.addLane = this.addLane.bind(this);
		this.addTask = this.addTask.bind(this);
		this.onLaneDrop = this.onLaneDrop.bind(this);
		this.onTaskDrop = this.onTaskDrop.bind(this);
		this.onLaneHide = this.onLaneHide.bind(this);
		this.onLaneEdit = this.onLaneEdit.bind(this);
	}

	async componentDidMount() {
		const tasksResponse = await Axios.get('http://localhost:3000/tasks');
		const lanesResponse = await Axios.get('http://localhost:3000/lanes');

		this.setState({ lanes: lanesResponse.data, tasks: tasksResponse.data });
	}

	async addLane() {
		const newLane = { title: 'New Lane', order: this.state.lanes.length + 1 };
		const laneResponse = await Axios.post('http://localhost:3000/lanes', newLane);

		this.setState({ lanes: this.state.lanes.concat(laneResponse.data) });
	}

	async addTask({ date = Date.now(), lane, subject, assignee } = {}) {
		const newTask = { date, lane, subject, assignee };
		const taskResponse = await Axios.post('http://localhost:3000/tasks', newTask);

		this.setState({ tasks: this.state.tasks.concat(taskResponse.data), adding: false });
	}

	onLaneDrop(fromId, toId) {
		const lanes = this.state.lanes.slice();
		const fromLane = lanes.find(lane => lane.id === fromId);
		const toLane = lanes.find(lane => lane.id === toId);

		[fromLane.order, toLane.order] = [toLane.order, fromLane.order];

		Axios.all([Axios.put(`http://localhost:3000/lanes/${fromLane.id}`, fromLane), Axios.put(`http://localhost:3000/lanes/${toLane.id}`, toLane)]);
		this.setState({ lanes });
	}

	onTaskDrop(taskId, newLaneId) {
		const tasks = this.state.tasks.slice();
		const taskToMove = tasks.find(task => task.id === taskId);

		taskToMove.lane = newLaneId;

		Axios.put(`http://localhost:3000/tasks/${taskToMove.id}`, taskToMove);
		this.setState({ tasks });
	}

	onLaneHide(laneId) {
		const lanes = this.state.lanes.slice();
		const laneToHide = lanes.find(lane => lane.id === laneId);
		laneToHide.hidden = true;

		Axios.put(`http://localhost:3000/lanes/${laneId}`, laneToHide);
		this.setState({ lanes });
	}

	onLaneEdit(laneId, newTitle) {
		if (!newTitle) return;

		const lanes = this.state.lanes.slice();
		const renamedLane = lanes.find(lane => lane.id === laneId);
		renamedLane.title = newTitle;

		Axios.put(`http://localhost:3000/lanes/${laneId}`, renamedLane);
		this.setState({ lanes });
	}

	render() {
		const lanes = this.state.lanes
			.filter(lane => !lane.hidden)
			.sort((lane1, lane2) => lane1.order - lane2.order)
			.map(lane => {
				const laneTasks = this.state.tasks.filter(task => task.lane === lane.id);
				return <Lane key={lane.id} id={lane.id} title={lane.title} tasks={laneTasks} onLaneDrop={this.onLaneDrop} onTaskDrop={this.onTaskDrop} onRemove={this.onLaneHide} onEdit={this.onLaneEdit} />;
			});

		return (
			<div id="board">
				{this.state.adding &&
					<FullScreenModal onClose={() => this.setState({ adding: false })}>
						<TaskModal onSubmit={this.addTask} onCancel={() => this.setState({ adding: false })} lanes={this.state.lanes} />
					</FullScreenModal>}
				<div className="buttons">
					<button onClick={() => this.setState({ adding: true })}>Add task</button>
					<button onClick={this.addLane}>Add lane</button>
				</div>
				<div className="lanes">{lanes}</div>
			</div>
		);
	}
}

export default Board;
