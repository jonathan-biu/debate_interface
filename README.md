# Description

A prototype application built in `react` and packaged by `tauri` to give a more streamlined judging experience to BP style debates
the app is localised to both `he` and `eng`

## plugins

the app uses the `fs` plugin to generate a `db.json` file in the data directory upon first init and edit the file as needed (e.g. adding new debates, updating speeches etc.)

## features

the app preserves newline characters and formats text such that text between `*` is bolded and red,it is also possible to highlight the text and use `ctrl + B`, text between `$` is bolded and blue, it is also possible to highlight the text and use `ctrl + D`
upon numbering arguments using the syntax `a.` or `1.` the program will create an ordered list when pressing `Enter`, it will tab and alternate list type when pressing `tab`, to resume unlisted writing, press `shift + enter`, a Navigation Bar exists to allow navigation between speakers when judging, supports light and dark mode
