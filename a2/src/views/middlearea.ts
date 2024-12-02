import { SKContainer } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { StackColLayout } from "../layouts/stackCol";
import { ListView } from "./listview";
import { QuizView } from "./quizview";

export class MiddleAreaView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    if (this.model.mode === "Quiz" && this.model.current === 1) {
      this.clearChildren();
      this.addChild(new QuizView(this.model));
    } else if (this.model.mode === "List") {
      this.clearChildren();
      this.addChild(new ListView(this.model, this.root));
    }
  }
  //#endregion
  

  constructor(private model: Model, private root: SKContainer) {
    super();

    this.id = "middlearea";
    // setup the view
    this.padding = 10;
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.layoutMethod = new StackColLayout();

    this.addChild(new ListView(this.model, root));

    // create controller
    //this.button.addEventListener("action", () => {});
    this.model.addObserver(this);
  }
}
