// local imports
import { Model } from "../model";
import View from "../view";
import { ListView } from "./listview";
import { QuizView } from "./quizview";

import "./middlearea.css";

export class MiddleAreaView implements View{
  //#region observer pattern

  update(): void {
    if (this.model.mode === "Quiz" && this.model.current === 1) {
        this.container.replaceChildren();
        this.container.appendChild(new QuizView(this.model).root);
    } else if (this.model.mode === "List") {
        this.container.replaceChildren();
        this.container.appendChild(new ListView(this.model).root);
    }
  }
  //#endregion

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.id = "middlearea";

    this.container.appendChild(new ListView(model).root);

    this.model.addObserver(this);
  }
}
