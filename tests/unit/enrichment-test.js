// import { render, fireEvent, cleanup } from "@testing-library/vue";
import { createModel } from "@xstate/test";
import { Machine } from "xstate";

describe("music player app", () => {
  const machine = Machine({});
  const testModel = createModel(machine).withEvents({});

  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => {
          return path.test();
        });
      });
    });
  });

  it("coverage", () => {
    testModel.testCoverage();
  });
});
