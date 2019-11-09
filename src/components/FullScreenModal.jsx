import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './Fade.css';
import Fade from './Fade.jsx';
import './FullScreenModal.css';

const FullScreenModal = ({ children, onClose }) => (
	<div className="full-screen-modal">
		<Fade onClick={onClose} />
		<div className="modal">{children}</div>
	</div>
);

FullScreenModal.displayName = 'FullScreenModal';
FullScreenModal.propTypes = {
	onClose: PropTypes.func,
	children: PropTypes.node,
};

export default FullScreenModal;
