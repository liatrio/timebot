const { App } = require("@slack/bolt");
const express = require("express");
const webserver = express();
import logger from "./logger";

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const app = new App({
  token: process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

webserver.get("/", (_: any, res: any) => {
  res.send("Timebot is running!");
  logger.debug("root path response sent");
});

var normalizedPath = require("path").join(__dirname, "commands");
require("fs")
  .readdirSync(normalizedPath)
  .forEach(function (file: string) {
	if(file.endsWith(".ts")) {
		console.log("registering:" + file);
    	require("./commands/" + file)(app);
	}
  });

(async () => {
  await app.start();
  webserver.listen(process.env.PORT || 3000);

  logger.info("⚡️ Bolt app is running!");
})();