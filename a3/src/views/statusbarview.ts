// local imports
import View from "../view";
import { Model } from "../model";

import "./statusbarview.css";

export class StatusBarView implements View {
  //#region observer pattern

  update(): void {
    const num = this.model.numQuestions;
    let text = `${num} question${num > 1 || num === 0 ? "s" : ""}`;
    if (this.model.numCheckedQuestions > 0) {
      text += ` (${this.model.numCheckedQuestions} selected)`;
    }
    this.message.innerText = text;
    if (this.model.cheat) this.cheatLabel.innerText = "CHEATING";
    else this.cheatLabel.innerText = "";
  }
  //#endregion

  message = document.createElement("span");
  cheatLabel = document.createElement("span");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {

    this.container = document.createElement("div");
    this.container.id = "statusbar";

    this.cheatLabel.id = "cheatlabel";

    this.container.appendChild(this.message);
    this.container.appendChild(this.cheatLabel);

    this.model.addObserver(this);
  }
}
