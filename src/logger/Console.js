const originalConsole = console;
const Console = {
    log: (message) => {
        originalConsole.log(message);
    }
}

module.exports = Console