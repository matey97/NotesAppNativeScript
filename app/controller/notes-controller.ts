import { NotesRepository } from "~/data/notes-repository";
import { Observable } from "rxjs";
import { Note } from "~/data/note";

export class NotesController {

  constructor(
    private repository: NotesRepository
  ) {
  }

  getNotes(): Observable<Array<Note>> {
    throw new Error("Unimplemented");
  }

  createNote(title: string, description: string): void {
    throw new Error("Unimplemented");
  }
}
