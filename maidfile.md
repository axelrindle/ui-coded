## create

Create a new project.

Usage: npx maid create <name>

```bash
# Die on error
die () {
  echo
  echo >&2 "$@"
  echo
  exit 1
}

# Make sure one argument is provided
[ "$#" -eq 1 ] || die "Provide a name for the new folder! \"npx maid create NAME_HERE\""

# Validate argument to be an alphanumeric string
! [[ "$1" =~ [^a-zA-Z0-9_-] ]] || die "'$1' must only contain letters, numbers, hyphens or underscores!"

echo " >  Creating new project at '$1'..."
rsync -aq --progress project-boilerplate/ packages/$1

echo " >  Done."
```

## serve

Start a local webserver to serve a package.

```js
require('./serve');
```

## sass

Compile the sass files for a package.

```js
require('./sass');
```
