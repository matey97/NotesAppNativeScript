import { Note } from "~/data/note";
import { Observable } from "rxjs";

export interface NotesRepository {
  getNoteChanges(): Observable<Array<Note>>;
  insert(note: Note): void;
  update(id: string, title: string, description: string);
  delete(id: string): void;
  clear(): void;
}
