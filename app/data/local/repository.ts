import { NotesRepository } from "~/data/notes-repository";
import { Note } from "~/data/note";
import { Observable } from "rxjs";

export class LocalRepository implements NotesRepository {

  getNoteChanges(): Observable<Array<Note>> {
    throw new Error("Unimplemented");
  }

  insert(note: Note): void {
    throw new Error("Unimplemented");
  }

  clear(): void {
    throw new Error("Unimplemented");
  }
}
