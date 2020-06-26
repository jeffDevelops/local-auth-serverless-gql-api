# Budgie API

The Budgie API is a serverless GraphQL API deployed on Vercel, backed by a PostgreSQL database, interfaced via TypeOrm and TypeGraphql.

To "start" in development mode:

```
npm run start
```

This removes the dist folder, rebuilds the TS project, runs any pending TypeOrm migrations that might exist, and then runs Vercel's dev mode.
Any changes made to the file system will trigger ts-node to rebuild, so that your changes are (somewhat) immediately reflected.

There isn't a server process to actually "start" here. The script just tells Vercel to serve the project statically, and any code found in
`/api/` directory will trigger serverless functions. The GraphQL API is one such serverless function, and is accessible at
http://localhost:3000/graphql.

This GraphQL playground repeatedly pings the serverless `apollo-server-micro` GraphQL handler with an introspection query to display the
current schema. In tandem with `tsc --watch`, the introspection query should essentially live-reload with your newest changes while you're
developing.

Environment variables are configured in Vercel.

To create a new migration:

```
npm run migration:create <the name of your migration here>
```

To deploy:

```
npm run deploy
```

To generate the Swift GraphQL schema,

```
npm codegen:schema
```

### Apollo Codegen Process

#### Include Apollo Package Dependencies

Go to File > Swift Packages > Add Package Dependency. A dialog to specify a package repository appears.

Specify https://github.com/apollographql/apollo-ios.git (don't forget the .git!) as the package repository.

Select "Up to next minor"

Select "Apollo" and "Apollo WebSocket"

#### Obtain the GraphQL Schema from the API

Instructions below loosely derived from https://www.apollographql.com/docs/ios/tutorial/tutorial-introduction/

To use the Apollo CLI from Xcode, add a Run Script build phase to your app:

Select the xcodeproj file in the Project Navigator, and then select the application target (will have the application icon next to it).

Select the Build Phases tab. Click the + button and select "New Run Script Phase"

Move the run script phase between Dependencies and Compile Sources -- it'll run after dependencies (Apollo iOS) are installed, and before
sources are compiled. In the shell code section paste the following Bash:

```
# Type a script or# Go to the build root and search up the chain to find the Derived Data Path where the source packages are checked out.
DERIVED_DATA_CANDIDATE="${BUILD_ROOT}"

while ! [ -d "${DERIVED_DATA_CANDIDATE}/SourcePackages" ]; do
  if [ "${DERIVED_DATA_CANDIDATE}" = / ]; then
    echo >&2 "error: Unable to locate SourcePackages directory from BUILD_ROOT: '${BUILD_ROOT}'"
    exit 1
  fi

  DERIVED_DATA_CANDIDATE="$(dirname "${DERIVED_DATA_CANDIDATE}")"
done

# Grab a reference to the directory where scripts are checked out
SCRIPT_PATH="${DERIVED_DATA_CANDIDATE}/SourcePackages/checkouts/apollo-ios/scripts"

if [ -z "${SCRIPT_PATH}" ]; then
    echo >&2 "error: Couldn't find the CLI script in your checked out SPM packages; make sure to add the framework to your project, and ensure that this build phase occurs between dependency installation and source compilation."
    exit 1
fi


cd "${SRCROOT}/${TARGET_NAME}"


"${SCRIPT_PATH}"/run-bundled-codegen.sh codegen:generate --target=swift --includes=./**/*.graphql --localSchemaFile="schema.json" API.swift drag a script file from your workspace to insert its path.
```

With this in place, start the local GraphQL server if not yet started. From the command line, run

```
apollo schema:download --endpoint="http://localhost:4000"
```

For convenience, the resulting schema.json file has been .gitignored in the root of the budgie-api directory. Drag it into the project directory, and leave all targets unchecked.

Write any new GraphQL queries/mutations you need to consume from the iOS client in GraphQL Playground/GraphiQL and place them in .graphql files (empty files in XCode) in the
project directory.

Then, build and run the project in XCode.

This generates an API.swift file
