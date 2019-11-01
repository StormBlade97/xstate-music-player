// import { render, fireEvent, cleanup } from "@testing-library/vue";
import { mount, createLocalVue } from "@vue/test-utils";
import Main from "@/components/MainSection.vue";
import { setup, cleanup } from "../utils/setupDependencies";
import UploadButton from "@/components/UploadButton";
import path from "path";

const fs = require("fs");

const localVue = createLocalVue();
// const uploadMachine = Machine({
//   id: "uploadMachineSUT",
//   context: {
//     tracks: []
//   },
//   initial: {
//     empty: {
//       on: {
//         LOAD_TRACK_SUCCESS: "ready"
//       },
//       meta: {
//           test: ({ getByTestId }) => {
//               const wrapper =
//           }
//       }
//     },
//     ready: {
//       meta: {}
//     }
//   }
// });

describe("upload tracks", () => {
  let wrapper;
  let store;
  beforeEach(() => {
    store = setup(localVue);
    const machineMixin = {
      computed: {
        currentState() {
          return this.$store.state.currentState;
        }
      },
      methods: {
        send(event) {
          this.$store.dispatch("sendEvent", event);
        }
      }
    };
    localVue.use(machineMixin);
    wrapper = mount(Main, {
      store
    });
  });
  afterEach(cleanup);

  it("should work", () => {
    expect(wrapper.contains("[data-test=empty-intro-page]")).toBe(true);
  });
  it("should show help screen if there is no tracks in the system", () => {
    expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(true);
  });
  describe("upload process", () => {
    const filename = "bensound-birthofahero.mp3";

    beforeEach(() => {
      const file = new File(
        fs.readFileSync(path.join(__dirname, "../mocks/file1.mp3")),
        filename,
        {
          type: "audio/mp3"
        }
      );
      wrapper
        .find(UploadButton)
        .find("input")
        .trigger("change", { files: [file] });
    });
    it("handle upload a fake song", () => {
      expect(store.state.currentState.matches("ready")).toBe(true);
      expect(wrapper.contains("[data-test=sidebar-empty-intro]")).toBe(false);
    });
  });
});
