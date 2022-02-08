module.exports = {
  name: '@addepar/style-toolbox',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonsToProject({
      packages: ['ember-cli-postcss'],
    });
  },
};
