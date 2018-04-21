
var assign = function(target, source) {
	for (var key in source) {
		if (source.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}
};

var endsWith = function(string, expected_ending) {
	if (string.length < expected_ending.length) {
		return false;
	} else {
		var actual_ending = string.substr(string.length - expected_ending.length);
		return actual_ending === expected_ending;
	}
};

var forEach = function(iterable, func) {
	var length = iterable.length;
	for (var i = 0; i < length; i++) {
		func(iterable[i], i);
	}
};

var invert = function(old_obj) {
	var new_obj = {};
	for (var key in old_obj) {
		if (old_obj.hasOwnProperty(key)) {
			var value = old_obj[key];
			new_obj[value] = key;
		}
	}
	return new_obj;
};

var times = function(times, func) {
    var results = [];
    for (var i = 0; i < times; i++){
        results.push(func(i));
    }
    return results;
};

module.exports = {
  assign: assign,
  endsWith: endsWith,
  forEach: forEach,
  invert: invert,
  times: times
};