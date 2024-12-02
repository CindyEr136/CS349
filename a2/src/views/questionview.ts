import { SKContainer, Layout, SKLabel } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { SKCheckbox } from "../widgets/checkbox";
import { StackColLayout } from "../layouts/stackCol";
import { EditPanelView } from "./editpanelview";

export class QuestionView extends SKContainer implements Observer {
  update(): void {
    const q = this.model.getQuestion(this.questionId);
    if (!q) return;
    this.questionText.text = q.question;
    this.checkbox.checked = q.done;
    if (this.model.mode === "Edit") {
        this.checkbox.disabled = true;
    }
  }

  checkbox = new SKCheckbox({ margin: 8 });
  questionText = new SKLabel({ text: "?", fillWidth: 1, align: "left" });
  textWrapper = new SKContainer({
    layoutMethod: new StackColLayout(),
    fillWidth: 1,
    padding: 8,
  });

  constructor(private model: Model, protected questionId: number, private rootContainer: SKContainer) {
    super();

    this.fill = "lightblue";
    this.fillWidth = 1;
    this.layoutMethod = new Layout.FillRowLayout({ gap: -8 });

    this.textWrapper.addChild(this.questionText);
    this.questionText.font = "10pt sans-serif";

    this.addChild(this.checkbox);
    this.addChild(this.textWrapper);

    this.checkbox.addEventListener("action", () => {
      //console.log(`Checkbox for question ${this.questionId} toggled: ${this.checkbox.checked}`)
      model.updateQuestion(questionId, { done: this.checkbox.checked });
    });

    this.textWrapper.addEventListener("dblclick", () => {
        this.model.mode = "Edit";
        const editPanel = new EditPanelView(this.model, this.questionId);
        this.rootContainer.addChild(editPanel);
        editPanel.show(rootContainer);
        //get root container
    })

    this.model.addObserver(this);
  }
}
