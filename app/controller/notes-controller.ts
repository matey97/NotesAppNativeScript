import { NotesRepository } from "~/data/notes-repository";
import { Observable } from "rxjs";
import { createNote, Note } from "~/data/note";
import { getLocalRepository } from "~/data/local/repository";
import { EmptyTitleError } from "~/errors/empty-title";

export class NotesController {

  constructor(
    private repository: NotesRepository = getLocalRepository()
  ) {
  }

  getNotes(): Observable<Array<Note>> {
    return this.repository.getNoteChanges();
  }

  createNote(title: string, description: string): void {
    if (title.length === 0) {
      throw new EmptyTitleError();
    }

    const note = createNote(title, description);
    this.repository.insert(note);
  }
}
