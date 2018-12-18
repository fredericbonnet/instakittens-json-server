/**
 * Cypress Cucumber world object.
 */
class World {
  constructor() {
    // Variable map used below.
    this.variables = {};
  }

  /*
   * Variable management.
   */

  /** Get variable value */
  getVariable(name) {
    return this.variables[name];
  }

  /** Set variable value */
  setVariable(name, value) {
    this.variables[name] = value;
  }

  /*
   * Nested resources.
   */

  /**
   * Set parent resource.
   *
   * @param key Key in child resources holding the parent ID
   * @param value Parent resource info
   * @param value.url Parent root URL
   * @param value.data Parent resource data
   * @param value.data.id Parent resource ID
   */
  setParent(key, value) {
    this.parent = { key, value };
  }

  /** Get parent root URL */
  getRoot() {
    return this.parent ? this.parent.value.url : '';
  }

  /**
   * Test whether a resource is a child of the current parent.
   *
   * @param child Child to test
   */
  isChild(child) {
    return !this.parent || child[this.parent.key] === this.parent.value.data.id;
  }
}

module.exports = { World };
