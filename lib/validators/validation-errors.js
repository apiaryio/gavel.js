class ValidationErrors {
  constructor(jsonErrors) {
    this.length = jsonErrors ? jsonErrors.length : 0;

    if (this.length > 0) {
      for (let i = 0; i < this.length; i++) {
        this[i] = jsonErrors[i];
      }
    }
  }
}

module.exports = {
  ValidationErrors
};
