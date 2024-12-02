import {
  startSimpleKit,
  setSKRoot,
  SKContainer,
  Layout,
  setSKEventListener,
  SKKeyboardEvent
} from "simplekit/imperative-mode";

// local imports
import { Model } from "./model";
import { ModeBarView } from "./views/modebarView";
import { MiddleAreaView } from "./views/middlearea";
import { StatusBarView } from "./views/statusbarview";
import { StackColLayout } from "./layouts/stackCol";

// data
const model = new Model();

// user interface

// root container
const root = new SKContainer({
  id: "root",
  layoutMethod: new Layout.CentredLayout(),
});
const main = new SKContainer ({
  id: "mainConainer",
  fill: "whitesmoke",
  fillHeight: 1,
  fillWidth: 1,
  layoutMethod: new StackColLayout(),
});

main.addChild(new ModeBarView(model));
main.addChild(new MiddleAreaView(model, root));
main.addChild(new StatusBarView(model));
root.addChild(main);

setSKEventListener((e) => {
  if (e.type === "keydown") {
    const { key } = e as SKKeyboardEvent;
    if (key === "?") {
      if (!model.cheat) model.cheat = true;
      else model.cheat = false;
    }
  }
})

setSKRoot(root);

startSimpleKit();

// Settings.debug = true;

//// call notifiyObservers when Escape key is pressed
//// (for debugging purposes, must use observer-debug include in model)
// setSKEventListener((e) => {
//   if (e.type === "keydown") {
//     const { key } = e as SKKeyboardEvent;
//     if (key === "Escape") {
//       model.notifyObservers();
//     }
//     // console.log(key);
//   }
// });
