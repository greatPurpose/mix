ampUi.math = {};
ampUi.math.getIndexOfClosestToInArray_Sequential = function(searchValue, sourceArray) { // Search "sourceArray" for the value which is closest to "searchValue" and return its index 
	var minimum, chosenIndex = 0;
	for(var i = 0; i < sourceArray.length; i++) {
		minimum = Math.abs(sourceArray[chosenIndex] - searchValue);
		if (Math.abs(sourceArray[i] - searchValue) < minimum) {
			chosenIndex = i;
		}
	}
	return chosenIndex;
};
ampUi.math.getIndexOfClosestToInArray_Binary = function(searchValue, sourceArray) { // Binary search works only on sorted arrays 
	var middleIndex;
	var lowIndex = 0;
	var highIndex = sourceArray.length - 1;
	while (highIndex - lowIndex > 1) {
		middleIndex = Math.floor((lowIndex + highIndex) / 2);
		if (sourceArray[middleIndex] < searchValue) {
			lowIndex = middleIndex;
		} else {
			highIndex = middleIndex;
		}
	}
	if (searchValue - sourceArray[lowIndex] <= sourceArray[highIndex] - searchValue) {
		return lowIndex;
	}
	return highIndex;
};
ampUi.math.createLogarithmicMap = function (arrayLength, beginningMapIndex, endingMapIndex, minValue, maxValue) { // Generate logarithmic map by provided values
    
	var map = new Array(Math.round(arrayLength));
	map.fill(Number.MAX_SAFE_INTEGER);
	var begin = Math.ceil(beginningMapIndex);
	var end = Math.floor(endingMapIndex);
	var width = end - begin;
	for(var i = begin; i <= end; i++) { 
		map[i] = Math.pow(10, (Math.log10(maxValue - minValue) / width * (i - begin))) + minValue;
	}
	return map;
};
ampUi.math.createLinearMap = function(arrayLength, beginningMapIndex, endingMapIndex, minValue, maxValue) { // Generate linear map by provided values
	var map = new Array(Math.round(arrayLength));
	map.fill(Number.MAX_SAFE_INTEGER);
	var begin = Math.floor(beginningMapIndex);
	var end = Math.ceil(endingMapIndex);
	var step = (maxValue - minValue) / (end - begin);
	for(var i = begin; i <= end; i++) { 
		map[i] = minValue + step * (i - begin);
	}
	return map;
};
ampUi.math.createLinearMap_Inverted = function(arrayLength, beginningMapIndex, endingMapIndex, minValue, maxValue) { // Linear map in reverse order 
	var map = new Array(Math.round(arrayLength));
	map.fill(Number.MAX_SAFE_INTEGER);
	var begin = Math.floor(beginningMapIndex);
	var end = Math.ceil(endingMapIndex);
	var step = (maxValue - minValue) / (end - begin);
	for(var i = begin; i <= end; i++) { 
		map[i] = maxValue - step * (i - begin);
	}
	return map;
};
ampUi.math.getRandom = function(min, max) {
	return Math.random() * (max - min) + min;
};
ampUi.math.getRandomInteger = function(min, max) {
	return Math.round(Math.random() * (max - min) + min);
};














