import { NotesRepository } from "~/data/notes-repository";
import { NotesController } from "~/controller/notes-controller";
import { LocalRepository } from "~/data/local/repository";
import { firstValueFrom, Observable } from "rxjs";
import { EmptyTitleError } from "~/errors/empty-title";
import { Note } from "~/data/note";
import { NoteNotFoundError } from "~/errors/note-not-found";

describe("NotesController integration tests", () => {

  let notesRepository: NotesRepository;
  let notesController: NotesController;

  const emptyTitle = "";
  const id1 = "id1";
  const title1 = "Test title 1";
  const description1 = "Test description 1";
  const id2 = "id2";
  const title2 = "Test title 2";
  const description2 = "Test description 2";

  const note1: Note = {
    id: id1,
    title: title1,
    description: description1,
    date: 0
  };

  const note2: Note = {
    id: id2,
    title: title2,
    description: description2,
    date: 0
  };

  beforeEach(() => {
    notesRepository = new LocalRepository();
    spyOn(notesRepository, "insert");
    spyOn(notesRepository, "update");
    spyOn(notesRepository, "delete");

    notesController = new NotesController(notesRepository);
  });

  it("H01_E01", async () => {
    // Given: no hay ninguna nota
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([]))
    );

    // When: se intenta crear una nota con título y descripción
    await notesController.createNote(title1, description1);

    // Then: se almacena la nota con el titulo y descripción dados
    expect(notesRepository.insert).toHaveBeenCalledWith(jasmine.objectContaining({
      title: title1,
      description: description1
    }));
  });

  it("H01_E03", async () => {
    // Given: no hay ninguna nota
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([]))
    );

    // When: se intenta crear una nota sin título
    await expectAsync(notesController.createNote(emptyTitle, description1))
      .toBeRejectedWith(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
    expect(notesRepository.insert).not.toHaveBeenCalled();
  });

  it("H02_E01", async () => {
    // Given: no hay ninguna nota
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([]))
    );

    // When: se consultan las notas
    const notes = await firstValueFrom(notesController.getNotes());

    // Then: se obtiene una lista vacía
    expect(notes.length).toBe(0);
  });

  it("H02_E02", async () => {
    // Given: hay varias notas almacenadas
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

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
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

    // When: se intenta cambiar el contenido de una nota
    const newTitle = "New note title";
    await notesController.updateNote(id2, newTitle, description2);

    // Then: la nota se actualiza correctamente
    expect(notesRepository.update).toHaveBeenCalledWith(id2, newTitle, description2);
  });

  it("H03_E02", async () => {
    // Given: hay varias notas almacenada
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

    // When: se intenta cambiar el contenido de una nota con un título inválido
    const newTitle = "";
    await expectAsync(notesController.updateNote(id2, newTitle, description2))
      .toBeRejectedWith(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
    expect(notesRepository.update).not.toHaveBeenCalled();
  });

  it("H03_E03", async () => {
    // Given: hay varias notas almacenadas
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

    // When: se intenta cambiar el contenido de una nota con un título inválido
    const newTitle = "Other title";
    await expectAsync(notesController.updateNote("", newTitle, description2))
      .toBeRejectedWith(new NoteNotFoundError("")); // Then: se lanza la excepción NoteNotFoundError
    expect(notesRepository.update).not.toHaveBeenCalled();
  });

  it("H04_E01", async () => {
    // Given: hay varias notas almacenadas
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

    // When: se intenta borrar una nota usando un id válido
    await notesController.deleteNote(id1);

    // Then: se elimina la nota de la base de datos
    expect(notesRepository.delete).toHaveBeenCalledWith(id1);
  });

  it("H04_E02", async () => {
    // Given: hay varias notas almacenadas
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([
        note1, note2
      ]))
    );

    // When: se intenta borrar una nota usando un id inválido
    await expectAsync(notesController.deleteNote(""))
      .toBeRejectedWith(new NoteNotFoundError("")); // Then: se lanza la excepción NoteNotFoundError
    expect(notesRepository.delete).not.toHaveBeenCalled();
  });

  afterEach(() => {
    notesRepository = null;
  });
});
