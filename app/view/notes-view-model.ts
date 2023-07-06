import { Dialogs, EventData, Observable, ObservableArray } from '@nativescript/core'
import { NoteUI } from "~/data/note-ui";
import { Fab } from "@nstudio/nativescript-floatingactionbutton";
import { NotesController } from "~/controller/notes-controller";
import { toNoteUI } from "~/data/mapping";
import { getBottomSheetService } from "~/view/bottomsheet/bottomsheet-service";

export class NotesViewModel extends Observable {

  private _notes: ObservableArray<NoteUI> = new ObservableArray<NoteUI>();
  get notes() {
    return this._notes
  }

  private addFab: Fab;

  constructor(
    private bottomSheetService = getBottomSheetService(),
    private notesController = new NotesController()
  ) {
    super();
    this.notesController.getNotes()
      .subscribe((notes) => {
        this._notes = new ObservableArray<NoteUI>(notes.map(toNoteUI));
        this.notifyPropertyChange("notes", this.notes);
      });
  }

  onAddFabLoaded(args: EventData) {
    this.addFab = <Fab>args.object;
  }

  onAddNoteTap() {
    this.bottomSheetService.openAddNoteSheet(
      (title, description) => {
        this.toggleFab(this.addFab, true);
        this.notesController.createNote(title, description)
          .catch((e) => Dialogs.alert({
            title: "¡Nota no añadida!",
            message: `Causa: ${e.message}`,
            okButtonText: "Ok"
          }));
      },
      () => {
        this.toggleFab(this.addFab, true);
      }
    )

    this.toggleFab(this.addFab, false);
  }

  private toggleFab(fab: Fab, show: boolean): void {
    fab.isEnabled = show;
    fab.animate({
      opacity: show ? 1 : 0,
      duration: 200
    });
  }
}
