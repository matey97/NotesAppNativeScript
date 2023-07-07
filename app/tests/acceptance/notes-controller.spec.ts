import { NotesRepository } from "~/data/notes-repository";
import { NotesController } from "~/controller/notes-controller";
import { LocalRepository } from "~/data/local/repository";
import { firstValueFrom } from "rxjs";
import { EmptyTitleError } from "~/errors/empty-title";
import { CouchBase } from "@triniwiz/nativescript-couchbase";
import { NoteNotFoundError } from "~/errors/note-not-found";

const DB_NAME = "test-db";

describe("Notes controller acceptance tests", () => {

  let database: CouchBase;
  let notesRepository: NotesRepository;
  let notesController: NotesController;

  const emptyTitle = "";
  const title1 = "Test title 1";
  const description1 = "Test description 1";
  const title2 = "Test title 2";
  const description2 = "Test description 2";

  beforeEach(() => {
    database = new CouchBase(DB_NAME);
    notesRepository = new LocalRepository(database);
    notesController = new NotesController(notesRepository);
  });

  it("H01_E01", async () => {
    // Given: no hay ninguna nota

    // When: se intenta crear una nota con título y descripción
    await notesController.createNote(title1, description1);

    // Then: se almacena la nota con el titulo y descripción dados
    const notes = await firstValueFrom(notesController.getNotes());
    expect(notes.length).toBe(1);
    expect(notes[0]).toEqual(jasmine.objectContaining({
      title: title1,
      description: description1
    }));
  });

  it("H01_E03", async () => {
    // Given: no hay ninguna nota

    // When: se intenta crear una nota sin título
    await expectAsync(notesController.createNote(emptyTitle, description1))
      .toBeRejectedWith(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
  });

  it("H02_E01", async () => {
    // Given: no hay ninguna nota

    // When: se consultan las notas
    const notes = await firstValueFrom(notesController.getNotes());

    // Then: se obtiene una lista vacía
    expect(notes.length).toBe(0);
  });

  it("H02_E02", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);

    // When: se consultan las notas
    const notes = await firstValueFrom(notesController.getNotes());

    // Then: se obtiene una lista con las notas almacenadas
    expect(notes.length).toBe(2);
    expect(notes[0]).toEqual(jasmine.objectContaining({
      title: title1,
      description: description1
    }));
    expect(notes[1]).toEqual(jasmine.objectContaining({
      title: title2,
      description: description2
    }));
  });

  it("H03_E01", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);

    const notesObservable = notesController.getNotes();
    let notes = await firstValueFrom(notesObservable);
    const noteId2 = notes[1].id;

    // When: se intenta cambiar el contenido de una nota
    const newTitle = "New note title";
    await notesController.updateNote(noteId2, newTitle, description2);

    // Then: la nota se actualiza correctamente
    notes = await firstValueFrom(notesObservable);

    expect(notes.length).toBe(2);
    expect(notes[1]).toEqual(jasmine.objectContaining({
      title: newTitle,
      description: description2
    }));
  });

  it("H03_E02", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);

    const notes = await firstValueFrom(notesController.getNotes());
    const noteId2 = notes[1].id;

    // When: se intenta cambiar el contenido de una nota con un título inválido
    const newTitle = "";
    await expectAsync(notesController.updateNote(noteId2, newTitle, description2))
      .toBeRejectedWith(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
  });

  it("H03_E03", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);


    // When: se intenta cambiar el contenido de una nota con un título inválido
    const newTitle = "Other title";
    await expectAsync(notesController.updateNote("", newTitle, description2))
      .toBeRejectedWith(new NoteNotFoundError("")); // Then: se lanza la excepción NoteNotFoundError
  });

  it("H04_E01", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);

    const notesObservable = notesController.getNotes();
    let notes = await firstValueFrom(notesObservable);
    const noteId1 = notes[0].id;

    // When: se intenta borrar una nota usando un id inválido
    await notesController.deleteNote(noteId1);

    // Then: se elimina la nota de la base de datos
    notes = await firstValueFrom(notesObservable);

    expect(notes.length).toBe(1);
    expect(notes[0]).toEqual(jasmine.objectContaining({
      title: title2,
      description: description2
    }));
  });

  it("H04_E02", async () => {
    // Given: hay varias notas almacenadas
    await notesController.createNote(title1, description1);
    await notesController.createNote(title2, description2);

    // When: se intenta borrar una nota usando un id inválido
    await expectAsync(notesController.deleteNote(""))
      .toBeRejectedWith(new NoteNotFoundError("")); // Then: se lanza la excepción NoteNotFoundError
  });

  afterEach(() => {
    notesRepository.clear();
  });
});
