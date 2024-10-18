# Multi-User Task Management-api

Complete Multi-User Task Management backend

## Documentation

https://documenter.getpostman.com/view/12343161/2sAXxWZoef

## STACKS

1. Node
2. ExpressJS
3. Typescript
4. TypeORM

- Package Manager: `npm`

## GET STARTED

1. Clone the repo and install dependencies using `npm install`
2. Duplicate the `.env.example` and rename one of them ot `.env`
3. Update the `.env with the appropriate values.
4. Follow the commit message convention below

## API DOCUMENTATION

## Commit Message Pattern Convention

You're to follow this convention when creating a commit message

```bash
    type(scope?): message
```

Example

```bash
    feat(controller): added auth controller
    fix: update the mentors model paths
```

### VIEW BACKEND API

Read more about it here [Commit Lint Doc](https://www.conventionalcommits.org/en/v1.0.0/) and here [Common Types Usage Text](https://commitlint.js.org/#/reference-prompt) to know more.

## NPM Commands

The following npm commands are available for managing and running the Express application:

- `npm run dev`: Starts the development server. This command is used during the development process to run the application with automatic reloading on code changes.

- `npm run watch`: This watches for changes in TypeScript files and automatically recompiles the project. It is used for development purposes.

- `npm run start:dev`: This runs the application in development mode using concurrently. It watches for TypeScript file changes and restarts the server automatically using nodemon.

- `npm run build`: This compiles the TypeScript files into JavaScript and places them into the build/ folder.

- `npm run typeorm`: This runs TypeORM's CLI tools, allowing to perform database operations such as generating migrations, running migrations, or updating the database schema.

- `npm start`: This runs the application using ts-node directly from the TypeScript source files. It's mainly used for quickly starting the application in development mode.

- `npm run migration`: Pushes the new migrations to the database. This command is used to apply the pending migrations to the database and update the schema accordingly.

Feel free to modify and use these commands according to your specific application needs.

## License

This Express application template is released under the [MIT License](https://opensource.org/licenses/MIT). Feel free to modify and use it for your own projects.
