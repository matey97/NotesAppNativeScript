import { Note } from "~/data/note";
import { NoteUI } from "~/data/note-ui";

export function toNoteUI(note: Note): NoteUI {
  return {
    id: note.id,
    title: note.title,
    description: note.description,
    date: new Date(note.date).toLocaleDateString(),
    selected: false
  }
}
