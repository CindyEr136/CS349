import {
  SKButton,
  SKContainer,
  Layout,
  SKLabel,
  SKTextfield,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { StackColLayout } from "../layouts/stackCol";

export class EditPanelView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    const q = this.model.getQuestion(this.qid);
    if (!q) return;
    this.text1.text = q.question;
    this.text2.text = q.answer;
    this.text3.text = q.other1;
    this.text4.text = q.other2;
  }
  //#endregion

  left = new SKContainer({
    fillWidth: 1,
    layoutMethod: new StackColLayout({ gap: 10 }),
  });
  right = new SKContainer({
    fillWidth: 4,
    layoutMethod: new StackColLayout({ gap: 10 }),
  });
  bottom = new SKContainer({
    fillWidth: 1,
    layoutMethod: new Layout.FillRowLayout({ gap: 10 }),
  });
  top = new SKContainer({
    fillWidth: 1,
    layoutMethod: new Layout.FillRowLayout({ gap: 10 }),
  });
  panel = new SKContainer({
    fillWidth: 1,
    fill: "whitesmoke",
    border: "black",
    padding: 30,
    layoutMethod: new StackColLayout({ gap: 10 }),
  }); //panel for the fields

  question = new SKLabel({ text: "Question", align: "right", fillWidth: 1 });
  answer = new SKLabel({ text: "Answer", align: "right", fillWidth: 1});
  other1 = new SKLabel({ text: "Other 1", align: "right", fillWidth: 1});
  other2 = new SKLabel({ text: "Other 2", align: "right", fillWidth: 1 });

  text1 = new SKTextfield({ fillWidth: 1 });
  text2 = new SKTextfield({ fillWidth: 1});
  text3 = new SKTextfield({ fillWidth: 1 });
  text4 = new SKTextfield({ fillWidth: 1});

  save = new SKButton({ text: "Save" });
  cancel = new SKButton({ text: "Cancel" });

  rect = new SKContainer({
    fillWidth: 1,
  }); //for the right justified elements

  private container: SKContainer | null = null;

  constructor(private model: Model, protected qid: number) {
    super();

    this.id = "editpanel";

    // setup the view
    this.fill = "rgba(0, 0, 0, 0.5)"; //semi transparent background
    this.padding = 60;
    this.fillWidth = 1;
    this.fillHeight = 1; 
    this.layoutMethod = new Layout.CentredLayout();

    //add widgets to the view
    this.left.addChild(this.question);
    this.left.addChild(this.answer);
    this.left.addChild(this.other1);
    this.left.addChild(this.other2);
    
    const q = model.getQuestion(qid);
    if (q) {
        this.text1.text = q.question;
        this.text2.text = q.answer;
        this.text3.text = q.other1;
        this.text4.text = q.other2;
    }
    this.right.addChild(this.text1);
    this.right.addChild(this.text2);
    this.right.addChild(this.text3);
    this.right.addChild(this.text4);

    this.top.addChild(this.left);
    this.top.addChild(this.right);

    this.bottom.addChild(this.rect);
    this.bottom.addChild(this.save);
    this.bottom.addChild(this.cancel);

    this.panel.addChild(this.top);
    this.panel.addChild(this.bottom);

    this.addChild(this.panel);

    // create controller
    this.save.addEventListener("action", () => {
      const q = model.getQuestion(this.qid);
      if (!q) return;
      model.updateQuestion(this.qid, { q: this.text1.text, a: this.text2.text, o1: this.text3.text, o2: this.text4.text, done: q.done }); //close panel after updating
      this.hide();
    });

    this.cancel.addEventListener("action", () => {
        this.hide();
    }); //close panel
  }

  show(root: SKContainer) {
    this.container = root;
  }

  hide() {
    this.model.mode = "List";
    if (this.container) this.container.removeChild(this);
  }
}
