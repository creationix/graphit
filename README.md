
# Single Binary Mode

To build a production binary, simply build this folder using lit and then run
the resulting binary.

```sh
lit make .
USERNAME=yourusername API_KEY=yourapikey ./graphit
```

# Develop

If you wish to hack on the code, use luvi in developer mode:

```sh
# The first time, you'll need to install deps locally
lit install
# Then start the server against the unpacked folder
USERNAME=yourusername API_KEY=yourapikey luvi .
```
