import { restore, stub } from "sinon";
import { expect } from 'chai';

import config from "../../src/config";
import { getQuarterDates } from "../../src/services/my_time";
import { describe } from "node:test";

const quarter = [1,1,1,2,2,2,3,3,3,4,4,4];

describe("services/my_time", () => {
  afterEach(() => {
    restore();
  });
  describe("getQuarterDatesNoInput", () => {
    it("Should return current quarter ending with current date", async () => {

      const result = getQuarterDates();

      const quarterBeginning = new Date(new Date().getFullYear(), (quarter[new Date().getMonth()] - 1) * 3, 1);

      expect(result[0].valueOf()).to.equal(quarterBeginning.valueOf());
      expect(result[1].setMilliseconds(0).valueOf()).to.equal(new Date().setMilliseconds(0).valueOf());
    });
  });

  describe("getQuarteDates", () => {
    it("Should return timestamps for first quarter of 2023",async () => {
      const result = getQuarterDates(1, 23);

      expect(result[0].valueOf()).to.equal(new Date(2023,0,1).valueOf());
      expect(result[1].valueOf()).to.equal(new Date(2023,2,31).valueOf());
    });
  });
});