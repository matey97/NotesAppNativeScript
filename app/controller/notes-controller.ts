import { NotesRepository } from "~/data/notes-repository";
import { firstValueFrom, Observable } from "rxjs";
import { createNote, Note } from "~/data/note";
import { getLocalRepository } from "~/data/local/repository";
import { EmptyTitleError } from "~/errors/empty-title";
import { NoteNotFoundError } from "~/errors/note-not-found";

export class NotesController {

  constructor(
    private repository: NotesRepository = getLocalRepository()
  ) {
  }

  getNotes(): Observable<Array<Note>> {
    return this.repository.getNoteChanges();
  }

  async createNote(title: string, description: string): Promise<void> {
    if (title.length === 0) {
      throw new EmptyTitleError();
    }

    const note = createNote(title, description);
    this.repository.insert(note);
  }

  async updateNote(id: string, title: string, description: string): Promise<void> {
    if (title.length === 0) {
      throw new EmptyTitleError();
    }

    const idExists = await this.idExists(id);
    if (!idExists) {
      throw new NoteNotFoundError(id);
    }

    this.repository.update(id, title, description);
  }

  async deleteNote(id: string): Promise<void> {
    const idExists = await this.idExists(id);
    if (!idExists) {
      throw new NoteNotFoundError(id);
    }

    this.repository.delete(id);
  }

  private async idExists(id: string): Promise<boolean> {
    const notes = await firstValueFrom(this.getNotes());
    return notes.find((note) => note.id === id) !== undefined;
  }
}
