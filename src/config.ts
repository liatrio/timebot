let _ = require("lodash");

const CONFIG = {
	logLevel: process.env.LOG_LEVEL || "info",
	recognizeEmoji: _.escapeRegExp(process.env.RECOGNIZE_EMOJI) || ":tr:",
	botName: process.env.BOT_NAME || "timebot"
};

module.exports = CONFIG;