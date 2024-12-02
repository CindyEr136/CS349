import { SKLabel, SKContainer, Layout } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";

export class StatusBarView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    const num = this.model.numQuestions;
    let text = `${num} question${num > 1 ? "s" : ""}`;
    //if (this.model.numCheckedQuestions > 0)
    text += ` (${this.model.numCheckedQuestions} selected)`;
    if (num === 0) text = "";
    this.message.text = text;
    if (this.model.cheat) this.cheatLabel.text = "CHEATING";
    else this.cheatLabel.text = "";
  }
  //#endregion

  message = new SKLabel({ text: "?", fillWidth: 1, align: "left" });
  cheatLabel = new SKLabel({ text: "", align: "right" });

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "statusbar";
    this.padding = 10;
    this.fillWidth = 1;
    this.fill = "lightgrey";
    this.layoutMethod = new Layout.FillRowLayout();

    this.addChild(this.message);
    this.addChild(this.cheatLabel);

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
