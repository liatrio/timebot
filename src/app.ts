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



webserver.get("/health", async (_: any, res: any) => {
	const status_checks: any = {};
  
	try {
	  const slack_api_status = await app.client.api.test();

	  if (slack_api_status.ok) {
		status_checks.slack_api = "OK";
	  }
	} catch (e: any) {
	  status_checks.slack_api = e.message;
	}
  
	try {
	  const slack_auth_status = await app.client.auth.test();

	  if (slack_auth_status.ok) {
		status_checks.slack_auth = "OK";
	  }
	} catch (e: any) {
	  status_checks.slack_auth = e.message;
	}
  
	status_checks.slack_websocket_connection = app.receiver.client.badConnection
	  ? "Connection Failed"
	  : "OK";
  
	for (const i in status_checks) {
	  if (status_checks[i] !== "OK") {
		res.status(500).send(status_checks);
	
		logger.error("Health check failed", {
		  status_checks,
		});
	
		return;
	  }
	}

	res.send(status_checks);
	logger.debug("Health check passed");
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