import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './IconButton.css';

const IconButton = ({ icon, onClick }) => <FontAwesomeIcon className="fa-button" icon={icon} onClick={onClick} />;

IconButton.displayName = 'IconButton';
IconButton.propTypes = {
	icon: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default IconButton;
