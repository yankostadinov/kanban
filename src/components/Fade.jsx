import React from 'react';
import PropTypes from 'prop-types';
import './Fade.css';

const Fade = ({ onClick }) => <div className="fade" onClick={onClick} />;

Fade.displayName = 'Fade';
Fade.propTypes = { onClick: PropTypes.func };

export default Fade;
