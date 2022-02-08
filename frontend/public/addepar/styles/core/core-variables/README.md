# Core - Core Variables

The `core-variables` directly translates design tokens into SASS variables. All variables in this directory should be abstracted in the `onyx` directory, or in your application. When abstracting `core-variables` the new variables should describe the variable's function, rather than the variable's style itself. See the example below.
```
// Right
$text-error: $red;

// Wrong
$text-red: $red;
```

### Disclaimer
It's important to understand that all changes made to this directory will affect the Addepar Style Toolbox globally, as these variables are being used through `core` and `onyx`. Please make sure any changes being made to this directory have been signed off by somebody on the Product Design Team.
