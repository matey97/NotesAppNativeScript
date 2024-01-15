# Notes app (NativeScript version)

Este repositorio contiene una pequeña aplicación desarrollada usando NativeScript (Android/iOS) cuyo objetivo es mostrar
implementación de historias de usuario, pruebas de aceptación y de integración.

Este es un proyecto de ejemplo para las asignaturas Diseño de Software (EI1039) y Paradigmas de
Software (EI1048) del Grado en Ingeniería Informática de la Universitat Jaume I de Castellón, España.

> [!Note]
> Para obtener la especificación de las historias de usuario, así como otros proyectos de
> ejemplo, visitar el siguiente [repositorio](https://github.com/matey97/NotesAppVersions).

## Tecnologías empleadas

La aplicación en este repositorio es una aplicación desarrollada mediante el framework de desarrollo multiplataforma
[NativeScript](https://nativescript.org), el cual permite compilar aplicaciones Android y iOS a partir del mismo código base.
Las tecnologías empleadas en este proyecto son las siguientes:

- Framework: [NativeScript](https://nativescript.org). El framework permite a su vez emplear algunos de los frameworks
mas comunes en el desarrollo web (Angular, Vue, React, etc.), pero en esta aplicación se ha empleado NativeScript plano.
- Lenguaje de programación: TypeScript.
- UI: [componentes básicos](https://docs.nativescript.org/ui-and-styling.html) de NativeScript y un plugin para [botones
flotantes](https://github.com/nstudio/nativescript-floatingactionbutton).
- DB: se emplea un [plugin basado en Couchbase Lite](https://triniwiz.github.io/nativescript-plugins/api-reference/couchbase.html#android),
una base de datos NoSQL.
- Tests: [Karma](https://karma-runner.github.io/latest/index.html) + [Jasmine](https://jasmine.github.io).

### Herramientas necesarias

- Configurar el entorno de desarrollo siguiendo [las guías de NativeScript](https://docs.nativescript.org/environment-setup.html).
- Un IDE como Visual Studio Code o WebStorm. Ambos tienen extensiones para facilitar el desarrollo con NativeScript.
- Dispositivo móvil Android o iOS físico o emulado (que el ordenador soporte virtualización).

> **Note**: para compilar la aplicacion para iOS es necesario tener un Mac. La aplicación Android puede compilarse
> desde cualquier sistema operativo (Windows, Mac, Linux).

> **Warning**: si surge cualquier problema, no dudéis en poneros en contacto.

## Estructura del repositorio

El repositorio contiene una gran cantidad de ficheros, pero lo que nos interesa esta en el directorio `app/`, donde
reside el código de la aplicación y las pruebas.

### La aplicación

Contiene los siguientes directorios y componentes:

- [`controller`](app/controller): contiene un fichero con la clase [`NotesController`](app/controller/notes-controller.ts), la cual implementa las operaciones de gestión de notas.
- [`data`](app/data): definición del modelo de datos y del repositorio. A destacar:
  - [`NoteRepository`](app/data/notes-repository.ts): interfaz que define los métodos que debe cumplir un repositorio. Permitiría intercambiar distintos repositorios (p.ej., local, remoto).
- [`errors`](app/errors): definición de excepciones.
- [`fonts`](app/fonts): fuente que permite utilzar Material Icons.
- [`utils`](app/utils): contiene el fichero [`uuid.ts`](app/utils/uuid.ts) que permite generar UUIDs usando código nativo para cada plataforma.
- [`view`](app/view): define la intefaz de la aplicación. Componentes:
  - `notes-page`: página principal de la aplicación que muestra la lista de notas y permite realizar las acciones de gestión (añadir, actualizar, eliminar).
  - `bottomsheet`: componente para añadir/editar notas.

Las aplicación puede compilarse y ejecutarse mediante el siguiente comando:

```bash
ns run {android|ios}
```

### Las pruebas: `tests`

En NativeScript, las deben incluirse por defecto en el directorio `app/tests/` y ser nombrados `*.spec.{ts|js}`. Las pruebas
estan organizadas en dos subdirectorios, `acceptance` e `integration`, incluyendo las pruebas de aceptación y de integracion,
respectivamente:

- [`acceptance/notes-controller.spec.ts`](app/tests/acceptance/notes-controller.spec.ts): pruebas de aceptación sobre
el componente `NotesController`. Se utilizan dependencias reales (base de datos).
- [`integration/notes-controller.spec.ts`](app/tests/integration/notes-controller.spec.ts): contiene pruebas de integración análogas a las de aceptación.
En estas pruebas, se inyecta un _mock_ de la base de datos a `NotesController`.

Las pruebas pueden ejecutarse mediante el siguiente comando:

```bash
ns test {android|ios}
```

> [!Note]
> Las pruebas se ejecutan en un dispositivo físico o virtual.

## Autor

<a href="https://github.com/matey97" title="Miguel Matey Sanz">
  <img src="https://avatars3.githubusercontent.com/u/25453537?s=120" alt="Miguel Matey Sanz" width="120"/>
</a>

## Licencia

El código de este repositorio esta bajo la licencia Apache 2.0 (ver [LICENSE](LICENSE)).
