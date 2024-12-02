import { SKContainer, Layout, SKLabel } from "simplekit/imperative-mode";

// local imports
import { Observer } from "../observer";
import { Model } from "../model";
import { DisabledButton } from "../widgets/disabledbutton";

export class ModeBarView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    let noneSelected = true;
    this.model.allQuestions().forEach((q) => {
      if (q.done) {
        noneSelected = false;
      }
    });
    this.button.disabled = noneSelected;
    if (this.model.mode === "Edit") {
      this.button.disabled = true;
      this.button.disabledColour = false;
    } else if (this.model.mode === "QuizDone") {
      this.text.text = "Quiz Completed!";
    } else if (this.model.mode === "Quiz") {
      this.button.text = "Exit";
      this.fill = "lightblue";
      this.text.text = `Question ${this.model.current} of ${this.model.numCheckedQuestions}`;
    } else {
      this.button.text = "Quiz";
      this.fill = "lightgrey";
      this.text.text = "";
    }
  }
  //#endregion
  //rectangle = new SKContainer({ fillWidth: 1 }); //to align the button on the right
  button = new DisabledButton({ text: "?", width: 100, disabled: false });
  text = new SKLabel({ text: "", fillWidth: 1, align: "left" });

  constructor(private model: Model) {
    super();

    this.id = "modebar";

    // setup the view
    this.padding = 10;
    this.fill = "lightgrey";
    this.layoutMethod = new Layout.FillRowLayout();
    this.fillWidth = 1;

    // add widgets to the view
    this.addChild(this.text);
    this.addChild(this.button);

    // create controller
    this.button.addEventListener("action", () => {
      //model.mode = (model.mode === "List") ? "Quiz" : "List";
      if (model.mode === "QuizDone" || model.mode === "Quiz") {
        model.mode = "List";
        model.current = 1;
      } else if (model.mode === "List") {
        //model.current = 1;
        //model.selectedQuestions = model.shuffleArray(model.selectedQuestions);
        model.mode = "Quiz";
      }
    });

    this.model.addObserver(this);
  }
}
