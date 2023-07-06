import { Note } from "~/data/note";
import { Observable } from "rxjs";

export interface NotesRepository {
  getNoteChanges(): Observable<Array<Note>>;
  insert(note: Note): void;
  clear(): void;
}
