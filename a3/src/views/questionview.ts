// local imports
import { Model } from "../model";
import View from "../view";

import "./questionview.css";

export class QuestionView implements View{
  update(): void {
    const q = this.model.getQuestion(this.questionId);
    if (!q) return;
    this.questionText.innerText = q.question;
    this.checkbox.checked = q.done;
    if (this.model.mode === "Edit") {
        this.checkbox.disabled = true;
    }
  }

  checkbox = document.createElement("input");
  questionText = document.createElement("span");
  

  private container: HTMLDivElement;
  get root() {
    return this.container;
  }

  constructor(private model: Model, protected questionId: number) {
    /*

    this.textWrapper.addEventListener("dblclick", () => {
        this.model.mode = "Edit";
        const editPanel = new EditPanelView(this.model, this.questionId);
        this.rootContainer.addChild(editPanel);
        editPanel.show(rootContainer);
        //get root container
    })*/

    this.container = document.createElement("div");
    this.container.id = "question";

    this.checkbox.type = "checkbox";

    this.container.appendChild(this.checkbox);
    this.container.appendChild(this.questionText);

    this.checkbox.addEventListener("click", () => {
        model.updateQuestion(questionId, {done: this.checkbox.checked });
    });

    this.model.addObserver(this);
  }
}
