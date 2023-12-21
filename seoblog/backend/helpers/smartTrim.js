exports.smartTrim = (str, length, delim, suffix) => {
    //str is the blog body, length is the length, delim is typically empty space
    //suffix is e.g. ...
    if (str.length <= length) {
        return str;
    }
    var trimmedStr = str.substr(0, length + delim.length);
    var lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) {
        trimmedStr = trimmedStr.substr(0, lastDelimIndex);
    }
    if (trimmedStr) {
        trimmedStr += suffix;
    }
    return trimmedStr;
}