import { BottomsheetViewModel } from "~/view/bottomsheet/bottomsheet-view-model";

export class AddBottomsheetViewModel extends BottomsheetViewModel {

  headerText: string = "Nueva nota";
  cancelButtonText: string = "Cancelar";
  confirmButtonText: string = "Añadir nota";

  constructor(
    onAdd: (title: string, description: string) => void,
    onCancel: () => void
  ) {
    super(onAdd, onCancel);
  }

}
