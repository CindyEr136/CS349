// local imports
import { Model } from "../model";
import View from "../view";
import { QuestionView } from "./questionview";

import "./questionlistview.css";

export class QuestionListView implements View {
  //#region observer pattern

  update(): void {
    this.container.replaceChildren();

    this.model.allQuestions().forEach((q) => {
      this.container.appendChild(new QuestionView(this.model, q.id).root);
    });
  }
  //#endregion

  private container: HTMLDivElement;
  get root() {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.id = "questionlist";

    if (model.mode === "Start") {
      /*for (let i = 0; i < 4; i++) {
          model.createQuestion();
        }*/
      this.model.setQuestions();
      this.model.mode = "List";
    }

    this.model.addObserver(this);
  }
}
