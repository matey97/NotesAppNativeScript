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
    expect(notesController.createNote(emptyTitle, description1))
      .toThrow(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
  });

  afterEach(() => {
    notesRepository.clear();
  });
});
