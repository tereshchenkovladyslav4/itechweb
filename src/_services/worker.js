
export default () => {	
	self.importScripts("test.js");// eslint-disable-line no-restricted-globals
	self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
		if (!e) return;
		const users = [];

		const origin = location.origin;// eslint-disable-line
		// const userDetails = {
		// 	name: 'Jane Doe',
		// 	email: 'jane.doe@gmail.com',
		// 	id: 1
		// };

		// for (let i = 0; i < 10000000; i++) {

		// 	userDetails.id = i++
		// 	userDetails.dateJoined = Date.now()

		// 	users.push(userDetails);
		// }

		postMessage(origin);
	})
}
