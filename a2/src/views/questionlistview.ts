import { SKContainer, Layout } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { QuestionView } from "./questionview";

export class QuestionListView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    this.children.forEach((q) => {
      // type guard: TodoView is an Observer
      if (q instanceof QuestionView) this.model.removeObserver(q);
    });

    // remove all current children
    this.clearChildren();

    // go through list of Todos, create a View for each
    this.model.allQuestions().forEach((q) => {
      this.addChild(new QuestionView(this.model, q.id, this.parent));
    });
  }
  //#endregion
  
  constructor(private model: Model, private parent: SKContainer) {
    super();

    this.id = "questionlist";

    // setup the view
    this.border = "black";
    this.padding = 10;
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.layoutMethod = new Layout.WrapRowLayout({ gap: 10 });

    if (model.mode === "Start") {
      for (let i = 0; i < 4; i++) {
        model.createQuestion();
      }
      model.mode = "List";
    }

    // create controller

    this.model.addObserver(this);
  }
}
