import { EventData, Page } from '@nativescript/core'
import { NotesViewModel } from './notes-view-model'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object
  page.bindingContext = new NotesViewModel()
}
