import React, { Component } from 'react';
import uuid from 'uuid/v4';
import './Board.css';
import Lane from './Lane.jsx';
import FullScreenModal from './FullScreenModal.jsx';

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
		this.onLaneRemove = this.onLaneRemove.bind(this);
		this.onLaneEdit = this.onLaneEdit.bind(this);
	}

	async componentDidMount() {
		let data;
		const localData = localStorage.getItem('database');

		if (localData) data = JSON.parse(localData);
		else data = await this.fetchData();

		this.setState(data);
	}

	async fetchData() {
		const response = await fetch('./api.json');

		if (!response.ok) throw Error(response.statusText);

		const json = await response.json();

		return json;
	}

	componentDidUpdate() {
		localStorage.setItem('database', JSON.stringify(this.state));
	}

	addLane() {
		const lanes = this.state.lanes.concat({
			id: uuid(),
			title: 'New Lane',
		});
		this.setState({ lanes });
	}

	addTask(event) {
		event.preventDefault();

		const tasks = this.state.tasks.concat({
			id: uuid(),
			date: Date.now(),
			lane: event.target.lane.value,
			subject: event.target.subject.value || 'New Task',
			assignee: event.target.assignee.value || 'Yan Kostadinov',
		});
		this.setState({ tasks, adding: false });
	}

	onLaneDrop(fromId, toId) {
		const fromIndex = this.state.lanes.findIndex(lane => lane.id === fromId);
		const toIndex = this.state.lanes.findIndex(lane => lane.id === toId);

		const lanes = this.state.lanes.slice();
		[lanes[fromIndex], lanes[toIndex]] = [lanes[toIndex], lanes[fromIndex]];

		this.setState({ lanes });
	}

	onTaskDrop(taskId, newLaneId) {
		const tasks = this.state.tasks.slice();
		const taskToMove = tasks.find(task => task.id === taskId);

		taskToMove.lane = newLaneId;

		this.setState({ tasks });
	}

	onLaneRemove(laneId) {
		const lanes = this.state.lanes.filter(lane => lane.id !== laneId);
		const tasks = this.state.tasks.filter(task => task.lane !== laneId);

		this.setState({ lanes, tasks });
	}

	onLaneEdit(laneId, newTitle) {
		if (!newTitle) return;

		const lanes = this.state.lanes.slice();
		const renamedLane = lanes.find(lane => lane.id === laneId);
		renamedLane.title = newTitle;

		this.setState({ lanes });
	}

	render() {
		const lanes = this.state.lanes.map(lane => {
			const laneTasks = this.state.tasks.filter(task => task.lane === lane.id);
			return <Lane key={lane.id} id={lane.id} title={lane.title} tasks={laneTasks} onLaneDrop={this.onLaneDrop} onTaskDrop={this.onTaskDrop} onRemove={this.onLaneRemove} onEdit={this.onLaneEdit} />;
		});

		return (
			<div id="board">
				{this.state.adding && <FullScreenModal onSubmit={this.addTask} lanes={this.state.lanes}/>}
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
