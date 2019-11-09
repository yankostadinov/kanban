import React from 'react';
import PropTypes from 'prop-types';
import './Fade.css';
import Fade from './Fade.jsx';
import './FullScreenModal.css';

const FullScreenModal = ({ children }) => (
	<div className="full-screen-modal">
		<Fade />
		<div className="modal">{children}</div>
	</div>
);

FullScreenModal.displayName = 'FullScreenModal';
FullScreenModal.propTypes = { children: PropTypes.node };

export default FullScreenModal;
