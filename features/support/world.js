/*
 * Cucumber world setup.
 */
var { setWorldConstructor } = require('cucumber');

class World {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;
    this.variables = {};
  }

  getVariable(name) {
    return this.variables[name];
  }
  setVariable(name, value) {
    this.variables[name] = value;
  }
}
setWorldConstructor(World);
