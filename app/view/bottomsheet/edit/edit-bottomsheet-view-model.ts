import { BottomsheetViewModel } from "~/view/bottomsheet/bottomsheet-view-model";

export class EditBottomsheetViewModel extends BottomsheetViewModel {

  headerText: string = "Editar nota";
  cancelButtonText: string = "Cancelar";
  confirmButtonText: string = "Actualizar nota";

  constructor(
    title: string,
    description: string,
    onEdit: (title: string, description: string) => void,
    onCancel: () => void
  ) {
    super(onEdit, onCancel);
    super.title = title;
    super.description = description;
  }

}
