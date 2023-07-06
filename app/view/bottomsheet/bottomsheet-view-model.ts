import { Observable } from "@nativescript/core";

export class BottomsheetViewModel extends Observable {

  title: string = "";
  description: string = "";

  constructor(
    private onConfirm: (title: string, description: string) => void,
    private onCancel: () => void
  ) {
    super();
  }

  onConfirmTap() {
    this.onConfirm(this.title, this.description);
  }

  onCancelTap() {
    this.onCancel();
  }
}
