// view for the middle area when in List mode

import View from "../view";
import { Model } from "../model";

import "./listview.css";
import { QuestionListView } from "./questionlistview";

export class ListView implements View {
  //#region observer pattern

  update(): void {
    let allSelected = true;
    let noneSelected = true;
    this.model.allQuestions().forEach((q) => {
      if (!q.done) allSelected = false;
      if (q.done) {
        noneSelected = false;
        return;
      }
    });
    this.all.disabled = allSelected;
    this.none.disabled = noneSelected;
    this.delete.disabled = noneSelected;
    this.add.disabled = this.model.numQuestions === 10;
    if (this.model.mode === "Edit") {
      this.all.disabled = true;
      this.none.disabled = true;
      this.delete.disabled = true;
      this.add.disabled = true;
    }
  }

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  toolbar = document.createElement("div");
  all = document.createElement("button");
  none = document.createElement("button");
  delete = document.createElement("button");
  add = document.createElement("button");

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className = "list";

    this.toolbar.id = "toolbar";

    this.all.innerText = "All";
    this.none.innerText = "None";
    this.delete.innerText = "Delete";
    this.add.innerText = "Add";

    this.toolbar.appendChild(this.all);
    this.toolbar.appendChild(this.none);
    this.toolbar.appendChild(this.delete);
    this.toolbar.appendChild(this.add);
    this.container.appendChild(this.toolbar);
    this.container.appendChild(new QuestionListView(model).root);

    this.all.addEventListener("click", () => {
      model
        .allQuestions()
        .forEach((q) => model.updateQuestion(q.id, { done: true }));
    });
    this.none.addEventListener("click", () => {
      model
        .allQuestions()
        .forEach((q) => model.updateQuestion(q.id, { done: false }));
    });
    this.delete.addEventListener("click", () => {
      const checkedQuestions = model.allQuestions().filter((q) => q.done).map((q) => q.id);
      if (checkedQuestions.length > 0) {
        model.deleteQuestions(checkedQuestions);
      }
    });
    this.add.addEventListener("click", () => {
      if (model.numQuestions < 10) model.createQuestion();
    });

    this.model.addObserver(this);
  }
}
