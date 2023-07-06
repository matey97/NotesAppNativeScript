import { uuid } from "~/utils/uuid";

export interface Note {
  id: string,
  title: string,
  description: string,
  date: number
}

export function createNote(title: string, description: string): Note {
  return {
    id: uuid(),
    title: title,
    description: description === "" ? "(No description)" : description,
    date: Date.now()
  }
}
