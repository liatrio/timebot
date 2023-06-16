import { table } from 'table';
import logger from "../logger";

module.exports = function (app: any) {
  app.message(
    "help",
    respond
  );
};

async function respond({ message, client }: any) {
  const commands = [];
  commands.push(["Command", "Description", "Options"]);
  commands.push(["mytime", "Get a report of your time for the quarter and a report of all active projects you are assigned to", "Optionally, you may supply the quarter and year in the format of:\nqX YY\nX = 1,2,3 or 4   YY = Last 2 digits of the year"]);
  commands.push(["projtime", "Get a report of time usage for a specific project. If you a manager on the project, also supplies time usage of project assignees", "The name or partial name of the project"]);

  const commandTable = table(commands);

  let response = `\`\`\`
  timebot: This slackbot is here to help you track your time across the quarter and across projects using the following commands:

${commandTable}

  If you have an questions regarding the outputs, please reach out to Jeremy Hayes
  \`\`\``;

  await client.chat.postEphemeral({
    channel: message.channel,
    user: message.user,
    text: response,
  });

  logger.debug("successfully posted ephemeral project time result to Slack", {
    func: "feature.project_time.respond",
    callingUser: message.user,
    slackMessage: message.text,
  });
}