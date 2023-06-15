import { table } from 'table';
import { getUserProjectAssignments, getUserTimeEntries, getActiveUserAssignments, getActiveProjectTimeEntries } from "../external/harvest";
import logger from "../logger";

export function getQuarterDates(quarter?: number, year?: number): [Date, Date] {
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  logger.info("currentYear: " + currentYear);

  if (year && year.toString().length <=2) {
    year += 2000;
  }
  const targetYear = year || currentYear;
  const targetQuarter = quarter || currentQuarter;

  const startDate = new Date(targetYear, (targetQuarter - 1) * 3, 1);
  const endDate = targetQuarter === currentQuarter ? new Date() : new Date(targetYear, targetQuarter * 3, 0);
  logger.info("startDate: " + startDate);
  logger.info("endDate: " + endDate);

  return [startDate, endDate];
}

export async function getMyProjects(userId: string) {
  const projects = getUserProjectAssignments(userId);

  return projects;
}

export async function getOptionTimes(message: string): Promise<[Date, Date]> {
  var startDate = new Date;
  var endDate = new Date;
  const options = message.replace(/.*mytime\s/, "").split(" ");
  if (options[1] == "mytime") {
    [startDate, endDate] = getQuarterDates();
  } else {
    const quarter = parseInt(options[0].replace(/^q/, ""));
    const year = parseInt(options[1]);
    logger.info("quarter: " + quarter);
    logger.info("year: " + year);
    if (quarter >= 1 && quarter <= 4) {
      [startDate, endDate] = getQuarterDates(quarter, year);
      logger.info("Start: " + startDate);
      logger.info("End: " + endDate);
    }
  }
  return [startDate, endDate];
}

export async function getMyTimeEntries(userId: string, startDate: Date, endDate: Date) {
  const timeEntries = getUserTimeEntries(userId, startDate.toISOString(), endDate.toISOString());

  return timeEntries;
}

export async function getQuarterlyTime(timeEntries: any) {
  var quarterlyTimes: any = {};
  quarterlyTimes["categories"] = [];
  quarterlyTimes["billable"] = 0;

  for (let entry of timeEntries.time_entries) {
    if (quarterlyTimes.categories.findIndex(((x: any) => x.name === entry.task.name)) < 0) {
      quarterlyTimes.categories.push({
        name: entry.task.name,
        time: 0,
      });
    }
    const categoryIndex = quarterlyTimes.categories.findIndex(((x: any) => x.name == entry.task.name));
    quarterlyTimes.categories[categoryIndex].time += entry.hours;
    if (timeEntries.billable == "true") {
      quarterlyTimes["billable"] += 0;
    }
  }

  return quarterlyTimes;
}

export async function getActiveProjectTimes(userId: string) {
  var activeProjectTimes: any = {};
  activeProjectTimes["projects"] = [];
  const activeUserAssignments = await getActiveUserAssignments(userId);

  for (let userAssignment of activeUserAssignments.user_assignments) {
    if (!userAssignment.project.name.includes("Liatrio")) {
      const projectTimeEntries = await getActiveProjectTimeEntries(userId, userAssignment.project.id)
      for (let entry of projectTimeEntries.time_entries) {
        if (activeProjectTimes.projects.findIndex(((x: any) => x.name === entry.project.name)) < 0) {
          activeProjectTimes.projects.push({
            name: entry.project.name,
            time: 0,
            budget: entry.user_assignment.budget
          });
        }
        const projectIndex = activeProjectTimes.projects.findIndex(((x: any) => x.name == entry.project.name));
        activeProjectTimes.projects[projectIndex].time += entry.hours;
      }
    }
  }

  return activeProjectTimes;
}

export async function getCategoryTimeString(quarterlyTimes: any) {
  var data = [];
  var categoryHeaders = [];
  var categoryTimes = [];

  for (let category of quarterlyTimes.categories) {
    categoryHeaders.push(category.name);
    categoryTimes.push(category.time);

    if (category.name == "Utilization") {
      var utilizationPercentage = Math.round((category.time / 430) * 100);
      categoryHeaders.push("Billable");
      categoryHeaders.push("Utilization %")
      categoryTimes.push(quarterlyTimes.billable);
      categoryTimes.push(utilizationPercentage);
    }
  }

  data.push(categoryHeaders);
  data.push(categoryTimes);

  return table(data);
}

export async function getProjectTimeString(quarterlyTimes: any) {
  var data = [];
  data.push(["Project", "Time", "Budget"]);

  for (let project of quarterlyTimes.projects) {
    data.push([project.name, project.time, project.budget]);
  }

  return table(data);
}