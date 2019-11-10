import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faEdit, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import IconButton from './IconButton.jsx';
import './EditableText.css';

const EditableText = ({ onToggle, onEdit, value }) => {
	const [editing, setEditing] = useState(false);

	const checkKeys = event => ['Escape', 'Enter'].includes(event.key) && handleEditEnd(event);
	const handleEditEnd = event => {
		setEditing(false);
		onEdit(event.target.value);
	};

	return (
		<div className="editable-text">
			{editing && <input type="text" placeholder={value} onKeyUp={checkKeys} onBlur={handleEditEnd} autoFocus={true} />}
			{!editing && <span>{value}</span>}
			<div className="buttons">
				<IconButton icon={faEdit} onClick={setEditing.bind(null, true)} />
				<IconButton icon={faEyeSlash} onClick={onToggle} />
			</div>
		</div>
	);
};

EditableText.displayName = 'EditableText';
EditableText.propTypes = {
	value: PropTypes.string.isRequired,
	onEdit: PropTypes.func.isRequired,
	onToggle: PropTypes.func.isRequired,
};

export default EditableText;
