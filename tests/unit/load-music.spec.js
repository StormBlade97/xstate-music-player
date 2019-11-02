// import { render, fireEvent, cleanup } from "@testing-library/vue";
import { mount, createLocalVue } from "@vue/test-utils";
import { createModel } from "@xstate/test";
import Main from "@/components/MainSection.vue";
import { setup, cleanup } from "../utils/setupDependencies";
import UploadButton from "@/components/UploadButton";
import getFile from "../utils/getMockAudio";
import { Machine } from "xstate";
import EmptyIntroPage from "@/components/EmptyIntroPage.vue";

const localVue = createLocalVue();

describe("music player app", () => {
  const machine = Machine({
    id: "uploadMachineSUT",
    context: {
      tracks: []
    },
    initial: "empty",
    states: {
      empty: {
        on: {
          LOAD_TRACK_SUCCESS: "ready"
        },
        meta: {
          test: ({ wrapper }) => {
            expect(wrapper.contains(EmptyIntroPage)).toBe(true);
            expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(
              true
            );
          }
        }
      },
      ready: {
        meta: {
          test: ({ wrapper }) => {
            expect(wrapper.contains(EmptyIntroPage)).toBe(false);
            expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(
              true
            );
            expect(wrapper.findAll("[data-test=track-item]")).toHaveLength(2);
          }
        }
      }
    }
  });
  const testModel = createModel(machine).withEvents({
    UPLOAD_TRACK: ({ wrapper }) => {
      wrapper.find(UploadButton).vm.$emit("loadFile", getFile());
    },
    LOAD_TRACK_SUCCESS: () => {}
  });

  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      let store, wrapper;
      beforeEach(() => {
        store = setup(localVue);
        wrapper = mount(Main, {
          store
        });
        window.URL.createObjectURL = jest
          .fn()
          .mockReturnValue("blob://Thisworks");
      });
      afterEach(() => {
        window.URL.createObjectURL.mockReset();
        cleanup();
      });
      plan.paths.forEach(path => {
        it(path.description, () => {
          return path.test({ wrapper });
        });
      });
    });
  });

  it("coverage", () => {
    testModel.testCoverage();
  });
});

describe("upload tracks", () => {
  let wrapper;
  let store;
  beforeEach(() => {
    store = setup(localVue);
    wrapper = mount(Main, {
      store
    });
    window.URL.createObjectURL = jest.fn().mockReturnValue("blob://Thisworks");
  });
  afterEach(() => {
    window.URL.createObjectURL.mockReset();
    cleanup();
  });

  it("should work", () => {
    expect(wrapper.contains("[data-test=empty-intro-page]")).toBe(true);
  });
  it("should show help screen if there is no tracks in the system", () => {
    expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(true);
  });

  it("handle upload a fake song", async () => {
    const files = getFile();
    wrapper.find(UploadButton).vm.$emit("loadFile", files);
    await new Promise(r => setTimeout(r, 1000));
    expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(false);
  });
});
