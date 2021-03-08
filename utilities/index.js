export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export const getFilesPath = () => {
	const dirArr = __dirname.split('/')
    const path = dirArr.reduce((acc, val, index) => (index + 1 === dirArr.length || val === '') 
        ? acc 
		: acc + '/' + val, '') + '/files/'
		
	return path
}