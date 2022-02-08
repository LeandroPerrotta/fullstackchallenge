module.exports = {
  name: '@addepar/style-toolbox',

  treeForStyles() {
    let Funnel = require('broccoli-funnel');
    let writeFile = require('broccoli-file-creator');
    let mergeTrees = require('broccoli-merge-trees');

    let stylesTree = new Funnel(`${this.root}/styles`, {
      destDir: '@addepar/style-toolbox',
    });

    let indexTree = writeFile('@addepar/style-toolbox.scss', "@import './style-toolbox/index';");

    return mergeTrees([stylesTree, indexTree]);
  },
};
