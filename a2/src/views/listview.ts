// view for the middle area when in List mode

import { SKContainer, Layout } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { DisabledButton } from "../widgets/disabledbutton";
import { QuestionListView } from "./questionlistview";
import { StackColLayout } from "../layouts/stackCol";

export class ListView extends SKContainer implements Observer {
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
        this.all.disabledColour = false;
        this.none.disabled = true;
        this.none.disabledColour = false;
        this.delete.disabled = true;
        this.delete.disabledColour = false;
        this.add.disabled = true;
        this.add.disabledColour = false;
    }
  }

  all = new DisabledButton({ text: "All", width: 80 });
  none = new DisabledButton({ text: "None", width: 80 });
  delete = new DisabledButton({ text: "Delete", width: 80 });
  add = new DisabledButton({ text: "Add", width: 80 });
  toolbar = new SKContainer({
    fill: "whitesmoke",
    border: "black",
    padding: 10,
    fillWidth: 1,
    layoutMethod: new Layout.FillRowLayout({ gap: 10 }),
  });


  constructor(private model: Model, private root: SKContainer) {
    super();

    this.id = "list";
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.layoutMethod = new StackColLayout();

    this.toolbar.addChild(this.all);
    this.toolbar.addChild(this.none);
    this.toolbar.addChild(this.delete);
    this.toolbar.addChild(this.add);

    this.addChild(this.toolbar);
    this.addChild(new QuestionListView(this.model, root));
    this.all.addEventListener("action", () => {
        model
          .allQuestions()
          .forEach((q) => model.updateQuestion(q.id, { done: true }));
      });
      this.none.addEventListener("action", () => {
        model
          .allQuestions()
          .forEach((q) => model.updateQuestion(q.id, { done: false }));
      });
      this.delete.addEventListener("action", () => {
        model.allQuestions().forEach((q) => {
          if (q.done) model.deleteQuestion(q.id);
        });
      });
      this.add.addEventListener("action", () => {
        if (model.numQuestions < 10) model.createQuestion();
      });
  
      this.model.addObserver(this);
  }
}
