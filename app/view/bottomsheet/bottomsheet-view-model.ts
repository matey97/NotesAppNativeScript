import { Observable } from "@nativescript/core";

export abstract class BottomsheetViewModel extends Observable {

  abstract headerText: string;
  abstract cancelButtonText: string;
  abstract confirmButtonText: string;

  title: string = "";
  description: string = "";

  protected constructor(
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
