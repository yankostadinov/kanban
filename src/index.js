import ReactDOM from 'react-dom';
import App from './components/App.jsx';

function createApp() {
	const app = new App();
	const appContainer = document.createElement('div');

	appContainer.id = 'root';
	document.body.appendChild(appContainer);

	ReactDOM.render(app, appContainer);
}

createApp();
