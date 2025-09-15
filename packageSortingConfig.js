/**
 * @fileoverview Package Sorting Configuration
 *
 * Contains all constants, thresholds, and classification rules used by the
 * package sorting system. This configuration can be modified to adjust
 * classification behavior without changing the core logic.
 *
 * @author Package Sorting System
 * @version 2.0.0
 */

// Classification threshold constants
const VOLUME_THRESHOLD = 1000000; // cm³
const DIMENSION_THRESHOLD = 150; // cm
const MASS_THRESHOLD = 20; // kg

// Stack name constants
const STANDARD = "STANDARD";
const SPECIAL = "SPECIAL";
const REJECTED = "REJECTED";

// Rule priority constants
const PRIORITY_HIGH = 1; // Rejected packages (both bulky and heavy)
const PRIORITY_MEDIUM = 2; // Special packages (bulky or heavy)
const PRIORITY_LOW = 3; // Standard packages (default case)

/**
 * Classification rules array defining the rule-based sorting logic.
 *
 * Rules are evaluated in priority order (lower number = higher priority).
 * Each rule contains a condition function that determines if the rule applies
 * to a given package, and a result that specifies the classification outcome.
 *
 * @type {Array<ClassificationRule>}
 *
 * @example
 * // The rules implement the following logic:
 * // 1. If package is both bulky AND heavy → REJECTED
 * // 2. If package is bulky OR heavy → SPECIAL
 * // 3. Otherwise → STANDARD
 */
const CLASSIFICATION_RULES = [
  {
    name: "rejected-packages",
    condition: (packageData) => packageData.bulky && packageData.heavy,
    result: REJECTED,
    priority: PRIORITY_HIGH,
  },
  {
    name: "special-packages",
    condition: (packageData) => packageData.bulky || packageData.heavy,
    result: SPECIAL,
    priority: PRIORITY_MEDIUM,
  },
  {
    name: "standard-packages",
    condition: (packageData) => true, // default case
    result: STANDARD,
    priority: PRIORITY_LOW,
  },
];

module.exports = {
  // Threshold constants
  /** @type {number} Volume threshold in cubic centimeters (1,000,000 cm³) */
  VOLUME_THRESHOLD,

  /** @type {number} Dimension threshold in centimeters (150 cm) */
  DIMENSION_THRESHOLD,

  /** @type {number} Mass threshold in kilograms (20 kg) */
  MASS_THRESHOLD,

  // Stack name constants
  /** @type {string} Standard package classification */
  STANDARD,

  /** @type {string} Special handling package classification */
  SPECIAL,

  /** @type {string} Rejected package classification */
  REJECTED,

  // Priority constants
  /** @type {number} High priority for rejected packages (both bulky and heavy) */
  PRIORITY_HIGH,

  /** @type {number} Medium priority for special packages (bulky or heavy) */
  PRIORITY_MEDIUM,

  /** @type {number} Low priority for standard packages (default case) */
  PRIORITY_LOW,

  // Classification rules
  /**
   * @type {Array<ClassificationRule>}
   * Default classification rules implementing the standard sorting logic
   */
  CLASSIFICATION_RULES,
};
