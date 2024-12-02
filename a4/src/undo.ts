import { signal } from "@preact/signals";

export interface Command {
  do(): void;
  undo(): void;
}

export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  canUndo = signal<Boolean>(false);
  canRedo = signal<Boolean>(false);

  constructor() {}

  execute(command: Command) {
    this.undoStack.push(command);
    this.redoStack = [];
    this.update();
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      this.redoStack.push(command);
      command.undo();
      this.update();
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      this.undoStack.push(command);
      command.do();
      this.update();
    }
  }
  private update() {
    this.canUndo.value = this.undoStack.length > 0;
    this.canRedo.value = this.redoStack.length > 0;
  }
}
