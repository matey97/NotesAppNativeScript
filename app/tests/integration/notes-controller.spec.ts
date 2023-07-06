import { NotesRepository } from "~/data/notes-repository";
import { NotesController } from "~/controller/notes-controller";
import { LocalRepository } from "~/data/local/repository";
import { Observable } from "rxjs";
import { EmptyTitleError } from "~/errors/empty-title";

describe("NotesController integration tests", () => {

  let notesRepository: NotesRepository;
  let notesController: NotesController;

  const emptyTitle = "";
  const title1 = "Test title 1";
  const description1 = "Test description 1";

  beforeEach(() => {
    notesRepository = new LocalRepository();
    spyOn(notesRepository, "insert");

    notesController = new NotesController(notesRepository);
  });

  it("H01_E01", () => {
    // Given: no hay ninguna nota
    spyOn(notesRepository, "getNoteChanges").and.returnValue(
      new Observable((subscriber) => subscriber.next([]))
    );

    // When: se intenta crear una nota con título y descripción
    notesController.createNote(title1, description1);

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
    expect(() => notesController.createNote(emptyTitle, description1))
      .toThrow(new EmptyTitleError()); // Then: se lanza la excepción EmptyTitleError
    expect(notesRepository.insert).not.toHaveBeenCalled();
  });

  afterEach(() => {
    notesRepository = null;
  });
});