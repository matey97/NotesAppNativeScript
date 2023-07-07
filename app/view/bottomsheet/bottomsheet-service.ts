import { Builder, CoreTypes, getRootLayout, RootLayoutOptions, View } from "@nativescript/core";
import { BottomsheetViewModel } from "~/view/bottomsheet/bottomsheet-view-model";
import { AddBottomsheetViewModel } from "~/view/bottomsheet/add/add-bottomsheet-view-model";
import { EditBottomsheetViewModel } from "~/view/bottomsheet/edit/edit-bottomsheet-view-model";

export class BottomSheetService {

  private _bottomSheet: View;
  private get bottomSheet() {
    if (!this._bottomSheet)
      this._bottomSheet = Builder.load({
        path: "~/view/bottomsheet",
        name: "bottomsheet"
      });
    return this._bottomSheet;
  }

  constructor(private rootLayout = getRootLayout()) {
  }

  openAddNoteSheet(
    onAddNote: (title: string, description: string) => void,
    onCancel: () => void
  ) {
    const context = new AddBottomsheetViewModel(
      (title, description) => {
        this.closeBottomSheet();
        onAddNote(title, description);
      },
      () => {
        this.closeBottomSheet();
        onCancel();
      }
    );
    this.openBottomSheet(context);
  }

  openEditNoteSheet(
    title: string,
    description: string,
    onEditNote: (title: string, description: string) => void,
    onCancel: () => void
  ) {
    const context = new EditBottomsheetViewModel(
      title,
      description,
      (title, description) => {
        this.closeBottomSheet();
        onEditNote(title, description);
      },
      () => {
        this.closeBottomSheet();
        onCancel();
      }
    );
    this.openBottomSheet(context);
  }

  private openBottomSheet(context: BottomsheetViewModel): void {
    this.bottomSheet.bindingContext = context;
    this.rootLayout.open(this.bottomSheet, options).catch((e) => console.log(e));
  }

  private closeBottomSheet() {
    this.rootLayout.close(this.bottomSheet)
  }
}

const options: RootLayoutOptions = {
  shadeCover: {
    color: '#FFF',
    opacity: 0.7,
    tapToClose: false,
  },
  animation: {
    enterFrom: {
      translateY: 500,
      duration: 300,
      curve: CoreTypes.AnimationCurve.cubicBezier(0.17, 0.89, 0.24, 1.11),
    },
    exitTo: {
      translateY: 500,
      duration: 300,
      curve: CoreTypes.AnimationCurve.cubicBezier(0.17, 0.89, 0.24, 1.11),
    },
  }
}

let _instance;
export function getBottomSheetService(): BottomSheetService {
  if (!_instance) {
    _instance = new BottomSheetService();
  }
  return _instance;
}
