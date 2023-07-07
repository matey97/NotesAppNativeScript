import { NotesRepository } from "~/data/notes-repository";
import { Note } from "~/data/note";
import { Observable } from "rxjs";
import { CouchBase } from "@triniwiz/nativescript-couchbase";

const DB_NAME = "notes-db";

export class LocalRepository implements NotesRepository {

  constructor(
    private db = new CouchBase(DB_NAME)
  ) {
  }

  getNoteChanges(): Observable<Array<Note>> {
    return new Observable<Array<Note>>((subscriber) => {
      const pushNotes = () => {
        const notes = this.db.query({
          select: []
        });
        subscriber.next(notes);
      };

      const dbListener = (_) => pushNotes();

      pushNotes();
      this.db.addDatabaseChangeListener(dbListener);

      return () => {
        this.db.removeDatabaseChangeListener(dbListener);
      }
    });
  }

  insert(note: Note): void {
    this.db.createDocument(note, note.id);
  }

  update(id: string, title: string, description: string): void {
    this.db.updateDocument(
      id,
      {
        title: title,
        description: description
      });
  }

  delete(id: string): void {
    this.db.deleteDocument(id);
  }

  clear(): void {
    const notes = this.db.query({
      select: [],
    });

    notes.forEach((note) => {
      this.db.deleteDocument(note.id);
    });
  }
}

let _instance;
export function getLocalRepository(): NotesRepository {
  if (!_instance) {
    _instance = new LocalRepository();
  }
  return _instance;
}
