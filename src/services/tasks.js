import Axios from 'axios';
const baseUrl = '/tasks';

const sendRequest = async(request) => {
	const response = await request();
	return Promise.resolve(response.data);
};

const getAll = () => {
	return sendRequest(() => Axios.get(baseUrl));
};

const create = note => {
	return sendRequest(() => Axios.post(baseUrl, note));
};

const update = (id, note) => {
	return sendRequest(() => Axios.put(`${baseUrl}/${id}`, note));
};

const remove = id => {
	return sendRequest(() => Axios.delete(`${baseUrl}/${id}`));
};

export default { getAll, create, update, remove };
