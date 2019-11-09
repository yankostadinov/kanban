import React from 'react';
import PropTypes from 'prop-types';
import './Fade.css';
import Fade from './Fade.jsx';
import TaskModal from './TaskModal.jsx';
import './FullScreenModal.css';

const FullScreenModal = ({ onSubmit, lanes }) => (
	<div className="modal">
		<Fade />
		<TaskModal onSubmit={onSubmit} lanes={lanes} />
	</div>
);

FullScreenModal.displayName = 'FullScreenModal';
FullScreenModal.propTypes = {
	children: PropTypes.node,
	onSubmit: PropTypes.func,
	lanes: PropTypes.arrayOf(PropTypes.object),
};

export default FullScreenModal;
