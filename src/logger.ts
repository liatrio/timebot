import { createLogger, format, transports } from "winston";
const { combine, timestamp, json } = format;

import config from "./config";

const loggingLevel = config.logLevel;

const loggerInstance = createLogger({
  label: timestamp(),
  level: loggingLevel,
  format: combine(timestamp(), json()),
  transports: [new transports.Console({ level: loggingLevel })],
});

export default loggerInstance;