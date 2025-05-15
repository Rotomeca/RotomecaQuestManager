const constants = {
  /**
   * @type {string}
   * @readonly
   */
  DIRECTORY_SEPARATOR: null,
};

Object.defineProperty(constants, "DIRECTORY_SEPARATOR", {
  get: function () {
    return process.platform === "win32" ? "\\" : "/";
  },
});

module.exports = Object.freeze(constants);
