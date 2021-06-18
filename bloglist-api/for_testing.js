const palindrome = string => {
	return string.split('').reverse().join('');
};

const average = array => {
	const reducer = (acc, act) => {
		return acc + act;
	};
	return array.length === 0
		? 0
		: array.reduce(reducer, 0) / array.length;
};

module.exports = {
	palindrome,
	average,
};
