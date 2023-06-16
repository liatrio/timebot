import { table, getBorderCharacters } from 'table';
import logger from "../logger";
import {getUserIdByEmail, getProjectByName} from "../services/harvest";
import { getProjectTimeEntries } from "../external/harvest";

module.exports = function (app: any) {
  app.message(
    "projtime",
    respond
  );
};

async function getSlackUserInfo(message: any, client: any) {
  const userInfo = await client.users.info({ user: message.user });

  if (userInfo.ok) {
    return userInfo.user;
  }

  logger.error("Slack API returned error from users.info", {
    func: "feature.project_time.respond",
    callingUser: message.user,
    slackMessage: message.text,
    error: userInfo.error,
  });

  await client.chat.postEphemeral({
    channel: message.channel,
    user: message.user,
    text: `Something went wrong while accessing project time. When retreiving user information from Slack, the API responded with the following error: ${userInfo.error}`,
  });
  
  return;
}

async function getHarvestProject(project: any, message: any, client: any) {
  const harvestProjects = await getProjectByName(project);

  if(!harvestProjects) {
   logger.error(`Could not find a project in Harvest: ${project}`, {
      func: "feature.project_time.respond"
    });

    await client.chat.postEphemeral({
      channel: message.channel,
      user: message.user,
      text: `Could not find a project in Harvest: ${project}`,
    });
  }

  if (harvestProjects.length == 1) {
    return harvestProjects[0];
  }

  await client.chat.postEphemeral({
    channel: message.channel,
    user: message.user,
    text: `There is more than one project with a name that matches the pattern: /.*${project}.*/gi, please try being more specific.`,
  });
  
  return;
}

async function getHarvestUserId(slackUserInfo: any, message: any, client: any) {
  const harvestUserId = await getUserIdByEmail(slackUserInfo.profile.email);

  if (harvestUserId) {
    return harvestUserId;
  }

  logger.error(`Could not find a user in Harvest for email: ${slackUserInfo.profile.email}`, {
    func: "feature.project_time.respond"
  });

  await client.chat.postEphemeral({
    channel: message.channel,
    user: message.user,
    text: `Could not find a user in Harvest for email: ${slackUserInfo.profile.email}`,
  });
  
  return;
}

function getProjectNameFromMessage(message: string) {
  const projectName = message.replace(/.*projtime\s/, "");

  if(projectName === message) {
    return "";
  }

  return projectName;
}

async function gatherInformation(projectName: any, message: any, client: any) {
  const slackUserInfo = await getSlackUserInfo(message, client);

  if(!slackUserInfo) {
    return;
  }

  const harvestUserId = await getHarvestUserId(slackUserInfo, message, client);

  if(!harvestUserId) {
    return;
  }

  const harvestProject = await getHarvestProject(projectName, message, client);

  if(!harvestProject) {
    return;
  }

  const timeEntries = await getProjectTimeEntries(harvestProject.id);
  const timeBuckets: any = {};

  for(const timeEntry of timeEntries.time_entries) {
    if(!timeBuckets[timeEntry.user.id]) {
      timeBuckets[timeEntry.user.id] = {
        name: timeEntry.user.name,
        project: {
          name: harvestProject.name,
          level: timeEntry.user_assignment.is_project_manager ? "manager" : "worker",
          active: timeEntry.user_assignment.is_active,
          spent: 0,
          budget: timeEntry.user_assignment.budget
        }
      };
    }

    timeBuckets[timeEntry.user.id].project.spent += timeEntry.hours;
  }

  return [harvestUserId, timeBuckets, harvestProject];
}

function getBudgetText(budget: any) {
  if(budget === 0 || budget === "0" || !budget) {
    return "unlimited";
  }

  return budget;
}

async function respond({ message, client }: any) {
  logger.info("@timebot project_time Called", {
    func: "feature.project_time.respond",
    callingUser: message.user,
    slackMessage: message.text,
  });

  const projectName = getProjectNameFromMessage(message.text);

  if(projectName === "") {
    logger.error(`No project name supplied in message: ${message}`, {
      func: "feature.project_time.respond"
    });

    await client.chat.postEphemeral({
      channel: message.channel,
      user: message.user,
      text: `No project name supplied in message: ${message.text}`,
    });

    return;
  }

  const [harvestUserId, timeBuckets, harvestProject]: any = await gatherInformation(projectName, message, client);

  const myBucket = timeBuckets[harvestUserId];

  let response = "";  
  const data = [];
  const reports = [];

  data.push(["Project", "Time", "Budget"]);

  if(myBucket.level === "manager") {
    let totalSpent = 0;

    reports.push(["Report", "Time", "Budget"]);

    for(const id in timeBuckets) {
      const bucket = timeBuckets[id];
      const budget = getBudgetText(bucket.project.budget);

      totalSpent += bucket.project.spent;
      
      reports.push([bucket.name, bucket.project.spent, budget]);
    }

    const projectBudget = getBudgetText(harvestProject.budget);

    data.push([myBucket.project.name, totalSpent, projectBudget]);
  } else {
    const budget = getBudgetText(myBucket.project.budget);

    data.push([myBucket.project.name, myBucket.project.spent, budget]);
  }
    
  const overall = table(data);
  const individual = reports.length > 0 ? "\n\n" + table(reports) : "";

  response = `\`\`\`${overall}${individual}\`\`\``;

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