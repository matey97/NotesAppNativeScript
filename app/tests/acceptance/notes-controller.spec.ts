import { NotesRepository } from "~/data/notes-repository";
import { NotesController } from "~/controller/notes-controller";
import { LocalRepository } from "~/data/local/repository";
import { firstValueFrom } from "rxjs";
import { EmptyTitleError } from "~/errors/empty-title";
import { CouchBase } from "@triniwiz/nativescript-couchbase";

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
    notesController.createNote(title1, description1);

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
    expect(() => notesController.createNote(emptyTitle, description1))
      .toThrow(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
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
    notesController.createNote(title1, description1);
    notesController.createNote(title2, description2);

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

  afterEach(() => {
    notesRepository.clear();
  });
});
