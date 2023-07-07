import { Dialogs, EventData, ItemEventData, ListView, Observable, ObservableArray } from '@nativescript/core'
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

  private noteSelected: number = undefined;
  private notesListView: ListView;

  private addFab: Fab;
  private editFab: Fab;
  private deleteFab: Fab;

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

  onListViewLoaded(args: EventData) {
    this.notesListView = <ListView>args.object;
  }

  onAddFabLoaded(args: EventData) {
    this.addFab = <Fab>args.object;
  }

  onEditFabLoaded(args: EventData) {
    this.editFab = <Fab>args.object;
  }

  onDeleteFabLoaded(args: EventData) {
    this.deleteFab = <Fab>args.object;
  }

  onNoteTap(args: ItemEventData) {
    const itemSelected = args.index;
    if (itemSelected !== this.noteSelected) {
      if (this.noteSelected !== undefined) {
        this.notes.getItem(this.noteSelected).selected = false;
      }
      this.notes.getItem(itemSelected).selected = true;
      this.noteSelected = itemSelected;
    } else {
      this.notes.getItem(this.noteSelected).selected = false;
      this.noteSelected = undefined;
    }

    this.toggleActionFabs([this.editFab, this.deleteFab], this.noteSelected !== undefined);
    this.notesListView.refresh();
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

    this.unselectNote();
    this.toggleFab(this.addFab, false);
  }

  onEditSelectedNoteTap() {
    const note = this.notes.getItem(this.noteSelected);
    this.bottomSheetService.openEditNoteSheet(
      note.title,
      note.description,
      (title, description) => {
        this.toggleActionFabs([this.addFab, this.editFab, this.deleteFab], true);
        this.notesController.updateNote(note.id, title, description)
          .then(() => this.unselectNote())
          .catch((e) => Dialogs.alert({
            title: "¡Nota no actualizada!",
            message: `Causa: ${e.message}`,
            okButtonText: "Ok"
          }));
      },
      () => {
        this.toggleActionFabs([this.addFab, this.editFab, this.deleteFab], true);
      }
    )
    this.toggleActionFabs([this.addFab, this.editFab, this.deleteFab], false);
  }

  onDeleteSelectedNoteTap() {
    const note = this.notes.getItem(this.noteSelected);
    this.notesController.deleteNote(note.id)
      .then(() => this.unselectNote())
      .catch((e) => console.log(e));
  }

  private unselectNote() {
    if (this.noteSelected === undefined)
      return;

    this.notes.getItem(this.noteSelected).selected = false;
    this.noteSelected = undefined;
    this.notesListView.refresh();
    this.toggleActionFabs([this.editFab, this.deleteFab], false);
  }

  private toggleFab(fab: Fab, show: boolean): void {
    fab.isEnabled = show;
    fab.animate({
      opacity: show ? 1 : 0,
      duration: 200
    });
  }

  private toggleActionFabs(fabs: Fab[], show: boolean) {
    fabs.forEach((fab) => this.toggleFab(fab, show));
  }
}
