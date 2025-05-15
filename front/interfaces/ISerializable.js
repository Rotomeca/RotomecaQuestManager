/**
 * Interface ISerializable
 * @interface
 */
export default class ISerializable {
  constructor() {
    if (new.target === ISerializable) {
      throw new TypeError("Cannot construct ISerializable instances directly");
    }
  }

  /**
   * Convertit l'instance en une chaîne de caractères.
   * Cette méthode doit être implémentée par les classes dérivées.
   * @abstract
   * @returns {string}
   */
  serialize() {
    throw new Error("Method 'serialize' must be implemented.");
  }
}
