import { getOptionTimes, getMyTimeEntries, getQuarterlyTime, getCategoryTimeString, getProjectTimeString, getActiveProjectTimes } from "../services/my_time";
import { getUserIdByEmail } from "../services/harvest";
import logger from "../logger";

module.exports = function (app: any) {
  app.message(
    "mytime",
    respondToMyTime
  );
};

async function respondToMyTime({message, client}: any) {
  logger.info("@timebot my_time Called", {
    func: "feature.my_time.respondToMyTime",
    callingUser: message.user,
    slackMessage: message.text,
  });

  let returnText = "";
  let debugMessage = "";

  const [startTime, endTime] = await getOptionTimes(message.text);

  if (startTime.valueOf() != endTime.valueOf()) {
    const userInfo = await client.users.info({ user: message.user });

    const harvestUserId = await getUserIdByEmail(userInfo.user.profile.email);
    
    const myTimeEntries = await getMyTimeEntries(harvestUserId, startTime, endTime);
    
    if (!(myTimeEntries.time_entries.length === 0)) {
      const quarterlyTime = await getQuarterlyTime(myTimeEntries);

      const activeProjectTime = await getActiveProjectTimes(harvestUserId);

      const categoryTimeString = await getCategoryTimeString(quarterlyTime);

      const projectTimeString = await getProjectTimeString(activeProjectTime);

      returnText = "```Time Summary for " + startTime.toLocaleDateString() + " - " + endTime.toLocaleDateString() + ":\n" + categoryTimeString;
      
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      if(endTime >= today) {
        returnText += "\n\nCurrently Active Projects:\n" + projectTimeString + "```";
      } else {
        returnText += "```";
      }

      debugMessage = "Successfully posted ephemeral my time result to Slack.";
    } else {
      returnText = "There were no time entries for the specified time.";
      debugMessage = "Failed to display times due to no time entries.";
    }
  } else {
    returnText = "The requested time is in the future.";
    debugMessage = "Failed to display times due to future time request.";
  }

  await client.chat.postEphemeral({
    channel: message.channel,
    user: message.user,
    text: returnText,
  });

  logger.debug(debugMessage, {
    func: "feature.my_time.respondToMyTime",
    callingUser: message.user,
    slackMessage: message.text,
  });

  return;
}