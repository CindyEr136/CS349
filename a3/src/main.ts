import { Model } from "./model";
import { MiddleAreaView } from "./views/middlearea";
import { ModeBarView } from "./views/modebarView";
import { StatusBarView } from "./views/statusbarview";

import "./main.css";

const model = new Model();

// root container (the div already in index.html)
const root = document.querySelector("div#app") as HTMLDivElement;

const main = document.createElement("div");
main.id = "main";

main.appendChild(new ModeBarView(model).root);
main.appendChild(new MiddleAreaView(model).root);
main.appendChild(new StatusBarView(model).root);
root.appendChild(main);

document.addEventListener("keydown", (e) => {
  if (e.key === "?") {
    if (!model.cheat) model.cheat = true;
    else model.cheat = false;
  }
})