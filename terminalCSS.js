const term = require('terminal-kit').terminal;





module.exports.setStyles = function setTerminalStyles() {
    term.windowTitle('Find Your Hat Game')
    
    term.bold();
    term.colorRgbHex(`#003300`);
    term.eraseDisplayAbove();
    term.setCursorColor('green');
    
}

module.exports.toCenter = function toCenter() {
    term.moveTo(term.width/2, term.height/2)
}

module.exports.printBlue = function printBlue(str) {
    term.blue(str);
}

module.exports.printMagenta = function printMagenta(str) {
    term.magenta(str);
}

module.exports.printWhite = function printWhite(str) {
    term.white(str);
}







