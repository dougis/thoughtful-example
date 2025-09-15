/**
 * @fileoverview Package Sorting Module - Rule-Based Classification System
 *
 * This module provides a flexible, rule-based approach to classifying packages
 * based on their physical dimensions and mass. The system uses a configurable
 * rule engine that can be extended with custom classification rules.
 *
 * @example
 * // Basic usage (backward compatible)
 * const { sort } = require('./packageSorting');
 * const result = sort(100, 50, 30, 15); // Returns "STANDARD"
 *
 * @example
 * // Advanced usage with custom rules
 * const { RuleEngine } = require('./packageSorting');
 * const customRules = [
 *   {
 *     name: "fragile-packages",
 *     condition: (pkg) => pkg.fragile === true,
 *     result: "FRAGILE",
 *     priority: 1
 *   },
 *   {
 *     name: "standard-packages",
 *     condition: (pkg) => true,
 *     result: "STANDARD",
 *     priority: 2
 *   }
 * ];
 * const engine = new RuleEngine(customRules);
 * const result = engine.evaluate({ fragile: true });
 *
 * @author Package Sorting System
 * @version 2.0.0
 */

const {
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD,
  CLASSIFICATION_RULES,
} = require("./packageSortingConfig");

/**
 * Determines if a package is bulky based on volume and dimension thresholds
 * @param {number} width - Package width in centimeters
 * @param {number} height - Package height in centimeters
 * @param {number} length - Package length in centimeters
 * @returns {boolean} True if package is bulky, false otherwise
 */
function isBulky(width, height, length) {
  // Check dimension threshold first (any dimension >= 150 cm)
  // This is more performant as it avoids the multiplication operation
  // when any single dimension already exceeds the threshold
  if (
    width >= DIMENSION_THRESHOLD ||
    height >= DIMENSION_THRESHOLD ||
    length >= DIMENSION_THRESHOLD
  ) {
    return true;
  }

  // Check volume threshold (width × height × length >= 1,000,000 cm³)
  // Only perform multiplication if no individual dimension exceeds threshold
  const volume = width * height * length;
  if (volume >= VOLUME_THRESHOLD) {
    return true;
  }

  return false;
}

/**
 * Determines if a package is heavy based on mass threshold
 * @param {number} mass - Package mass in kilograms
 * @returns {boolean} True if package is heavy, false otherwise
 */
function isHeavy(mass) {
  // Check mass threshold (>= 20 kg)
  return mass >= MASS_THRESHOLD;
}

/**
 * Rule Engine class for evaluating classification rules in priority order.
 *
 * The RuleEngine provides a flexible, extensible system for package classification
 * that separates rule definitions from evaluation logic. Rules are processed in
 * priority order (lower numbers = higher priority) and the first matching rule
 * determines the classification result.
 *
 * @class RuleEngine
 * @example
 * // Create engine with default rules
 * const { RuleEngine, CLASSIFICATION_RULES } = require('./packageSorting');
 * const engine = new RuleEngine(CLASSIFICATION_RULES);
 *
 * @example
 * // Create engine with custom rules
 * const customRules = [
 *   {
 *     name: "oversized-packages",
 *     condition: (pkg) => pkg.width > 200 || pkg.height > 200,
 *     result: "OVERSIZED",
 *     priority: 1
 *   },
 *   {
 *     name: "standard-packages",
 *     condition: (pkg) => true,
 *     result: "STANDARD",
 *     priority: 2
 *   }
 * ];
 * const engine = new RuleEngine(customRules);
 *
 * @example
 * // Dynamic rule management
 * const engine = new RuleEngine(CLASSIFICATION_RULES);
 *
 * // Add a new rule for express packages
 * engine.addRule({
 *   name: "express-packages",
 *   condition: (pkg) => pkg.express === true,
 *   result: "EXPRESS",
 *   priority: 0 // Highest priority
 * });
 *
 * // Remove a rule
 * engine.removeRule("standard-packages");
 */
class RuleEngine {
  /**
   * Creates a new RuleEngine instance with the provided rules.
   *
   * @param {Array<ClassificationRule>} rules - Array of rule objects to evaluate
   * @param {string} rules[].name - Unique identifier for the rule
   * @param {Function} rules[].condition - Function that takes packageData and returns boolean
   * @param {string} rules[].result - Classification result to return if condition matches
   * @param {number} rules[].priority - Rule priority (lower numbers = higher priority)
   *
   * @throws {Error} If rules array is invalid or contains invalid rules
   *
   * @example
   * const rules = [
   *   {
   *     name: "heavy-packages",
   *     condition: (pkg) => pkg.mass > 50,
   *     result: "HEAVY",
   *     priority: 1
   *   }
   * ];
   * const engine = new RuleEngine(rules);
   */
  constructor(rules) {
    if (!Array.isArray(rules)) {
      throw new Error("Rules must be an array");
    }

    if (rules.length === 0) {
      throw new Error("Rules array cannot be empty");
    }

    // Validate each rule and store them
    this.rules = rules.map((rule) => this._validateRule(rule));

    // Sort rules by priority (lower number = higher priority)
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Validates a single rule object
   * @param {Object} rule - Rule object to validate
   * @returns {Object} The validated rule object
   * @throws {Error} If rule is invalid
   * @private
   */
  _validateRule(rule) {
    if (!rule || typeof rule !== "object") {
      throw new Error("Rule must be an object");
    }

    const requiredProperties = ["name", "condition", "result", "priority"];
    for (const prop of requiredProperties) {
      if (!(prop in rule)) {
        throw new Error(`Rule is missing required property: ${prop}`);
      }
    }

    if (typeof rule.name !== "string" || rule.name.trim() === "") {
      throw new Error("Rule name must be a non-empty string");
    }

    if (typeof rule.condition !== "function") {
      throw new Error("Rule condition must be a function");
    }

    if (typeof rule.result !== "string" || rule.result.trim() === "") {
      throw new Error("Rule result must be a non-empty string");
    }

    if (
      typeof rule.priority !== "number" ||
      rule.priority < 0 ||
      !Number.isFinite(rule.priority)
    ) {
      throw new Error("Rule priority must be a non-negative number");
    }

    return rule;
  }

  /**
   * Evaluates package data against all rules and returns the first match.
   *
   * Rules are processed in priority order (lowest priority number first).
   * The first rule whose condition function returns true determines the result.
   *
   * @param {PackageData} packageData - Package data object with dimensions, mass, and computed flags
   * @param {number} packageData.width - Package width in centimeters
   * @param {number} packageData.height - Package height in centimeters
   * @param {number} packageData.length - Package length in centimeters
   * @param {number} packageData.mass - Package mass in kilograms
   * @param {boolean} packageData.bulky - Whether package is bulky (computed)
   * @param {boolean} packageData.heavy - Whether package is heavy (computed)
   *
   * @returns {string} Classification result from the first matching rule
   * @throws {Error} If packageData is invalid or no rules match
   *
   * @example
   * const packageData = {
   *   width: 100, height: 50, length: 30, mass: 25,
   *   bulky: false, heavy: true
   * };
   * const result = engine.evaluate(packageData); // Returns "SPECIAL"
   */
  evaluate(packageData) {
    if (!packageData || typeof packageData !== "object") {
      throw new Error("Package data must be an object");
    }

    // Evaluate rules in priority order
    for (const rule of this.rules) {
      try {
        if (rule.condition(packageData)) {
          return rule.result;
        }
      } catch (error) {
        throw new Error(
          `Error evaluating rule "${rule.name}": ${error.message}`
        );
      }
    }

    // This should never happen if rules include a default case
    throw new Error("No matching rule found for package data");
  }

  /**
   * Adds a new rule to the engine dynamically.
   *
   * The rule is validated and inserted in the correct priority position.
   * Rule names must be unique within the engine.
   *
   * @param {ClassificationRule} rule - Rule object to add
   * @param {string} rule.name - Unique identifier for the rule
   * @param {Function} rule.condition - Function that takes packageData and returns boolean
   * @param {string} rule.result - Classification result to return if condition matches
   * @param {number} rule.priority - Rule priority (lower numbers = higher priority)
   *
   * @throws {Error} If rule is invalid or name conflicts with existing rule
   *
   * @example
   * // Add a rule for temperature-sensitive packages
   * engine.addRule({
   *   name: "temperature-sensitive",
   *   condition: (pkg) => pkg.temperatureSensitive === true,
   *   result: "CLIMATE_CONTROLLED",
   *   priority: 1
   * });
   */
  addRule(rule) {
    const validatedRule = this._validateRule(rule);

    // Check for duplicate rule names
    if (
      this.rules.some(
        (existingRule) => existingRule.name === validatedRule.name
      )
    ) {
      throw new Error(`Rule with name "${validatedRule.name}" already exists`);
    }

    this.rules.push(validatedRule);
    // Re-sort rules by priority
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Removes a rule from the engine by name.
   *
   * @param {string} ruleName - Name of the rule to remove
   * @throws {Error} If rule name is not found
   *
   * @example
   * // Remove the standard packages rule to create a more restrictive system
   * engine.removeRule("standard-packages");
   */
  removeRule(ruleName) {
    if (typeof ruleName !== "string" || ruleName.trim() === "") {
      throw new Error("Rule name must be a non-empty string");
    }

    const initialLength = this.rules.length;
    this.rules = this.rules.filter((rule) => rule.name !== ruleName);

    if (this.rules.length === initialLength) {
      throw new Error(`Rule with name "${ruleName}" not found`);
    }
  }
}

/**
 * Sorts packages into appropriate stacks based on dimensions and mass.
 *
 * This is the main entry point for package classification. It maintains
 * backward compatibility with the original API while using the new rule-based
 * system internally.
 *
 * @param {number} width - Package width in centimeters
 * @param {number} height - Package height in centimeters
 * @param {number} length - Package length in centimeters
 * @param {number} mass - Package mass in kilograms
 *
 * @returns {string} Stack name: "STANDARD", "SPECIAL", or "REJECTED"
 *
 * @example
 * // Standard package
 * const result1 = sort(50, 30, 20, 10); // Returns "STANDARD"
 *
 * @example
 * // Bulky package (volume > 1,000,000 cm³)
 * const result2 = sort(200, 100, 50, 15); // Returns "SPECIAL"
 *
 * @example
 * // Heavy package (mass >= 20 kg)
 * const result3 = sort(50, 30, 20, 25); // Returns "SPECIAL"
 *
 * @example
 * // Both bulky and heavy package
 * const result4 = sort(200, 100, 50, 25); // Returns "REJECTED"
 */
function sort(width, height, length, mass) {
  // Create package data object with computed bulky/heavy flags
  const packageData = {
    width,
    height,
    length,
    mass,
    bulky: isBulky(width, height, length),
    heavy: isHeavy(mass),
  };

  // Create rule engine instance and evaluate package data
  const ruleEngine = new RuleEngine(CLASSIFICATION_RULES);
  return ruleEngine.evaluate(packageData);
}

/**
 * @typedef {Object} ClassificationRule
 * @property {string} name - Unique identifier for the rule
 * @property {Function} condition - Function that takes packageData and returns boolean
 * @property {string} result - Classification result to return if condition matches
 * @property {number} priority - Rule priority (lower numbers = higher priority)
 */

/**
 * @typedef {Object} PackageData
 * @property {number} width - Package width in centimeters
 * @property {number} height - Package height in centimeters
 * @property {number} length - Package length in centimeters
 * @property {number} mass - Package mass in kilograms
 * @property {boolean} bulky - Whether package is bulky (computed)
 * @property {boolean} heavy - Whether package is heavy (computed)
 */

// Export all functions and classes for backward compatibility and extensibility
module.exports = {
  /**
   * Rule-based classification engine for extensible package sorting.
   * Use this class to create custom classification systems with your own rules.
   *
   * @example
   * // Create a custom classification system
   * const { RuleEngine } = require('./packageSorting');
   * const customRules = [
   *   {
   *     name: "priority-packages",
   *     condition: (pkg) => pkg.priority === "high",
   *     result: "PRIORITY",
   *     priority: 1
   *   },
   *   {
   *     name: "regular-packages",
   *     condition: (pkg) => true,
   *     result: "REGULAR",
   *     priority: 2
   *   }
   * ];
   * const engine = new RuleEngine(customRules);
   *
   * @type {typeof RuleEngine}
   */
  RuleEngine,

  /**
   * Determines if a package is bulky based on volume and dimension thresholds.
   * A package is bulky if any dimension >= 150cm OR volume >= 1,000,000 cm³.
   *
   * @example
   * const { isBulky } = require('./packageSorting');
   * const bulky1 = isBulky(200, 50, 30); // true (width >= 150cm)
   * const bulky2 = isBulky(100, 100, 100); // true (volume = 1,000,000 cm³)
   * const bulky3 = isBulky(50, 30, 20); // false
   *
   * @type {Function}
   */
  isBulky,

  /**
   * Determines if a package is heavy based on mass threshold.
   * A package is heavy if mass >= 20 kg.
   *
   * @example
   * const { isHeavy } = require('./packageSorting');
   * const heavy1 = isHeavy(25); // true
   * const heavy2 = isHeavy(15); // false
   *
   * @type {Function}
   */
  isHeavy,

  /**
   * Main package sorting function with backward-compatible API.
   * Classifies packages as "STANDARD", "SPECIAL", or "REJECTED" based on
   * dimensions and mass using the rule-based system.
   *
   * @example
   * const { sort } = require('./packageSorting');
   *
   * // Standard package
   * console.log(sort(50, 30, 20, 10)); // "STANDARD"
   *
   * // Special package (bulky or heavy, but not both)
   * console.log(sort(200, 50, 30, 15)); // "SPECIAL" (bulky)
   * console.log(sort(50, 30, 20, 25)); // "SPECIAL" (heavy)
   *
   * // Rejected package (both bulky and heavy)
   * console.log(sort(200, 100, 50, 25)); // "REJECTED"
   *
   * @type {Function}
   */
  sort,
};

/**
 * @example <caption>Extending the System with Custom Rules</caption>
 *
 * // Example 1: Adding a new classification for fragile packages
 * const { RuleEngine } = require('./packageSorting');
 *
 * const extendedRules = [
 *   {
 *     name: "fragile-packages",
 *     condition: (pkg) => pkg.fragile === true,
 *     result: "FRAGILE_HANDLING",
 *     priority: 1 // Highest priority
 *   },
 *   {
 *     name: "rejected-packages",
 *     condition: (pkg) => pkg.bulky && pkg.heavy,
 *     result: "REJECTED",
 *     priority: 2
 *   },
 *   {
 *     name: "special-packages",
 *     condition: (pkg) => pkg.bulky || pkg.heavy,
 *     result: "SPECIAL",
 *     priority: 3
 *   },
 *   {
 *     name: "standard-packages",
 *     condition: (pkg) => true,
 *     result: "STANDARD",
 *     priority: 4
 *   }
 * ];
 *
 * const engine = new RuleEngine(extendedRules);
 *
 * // Usage with extended package data
 * const packageData = {
 *   width: 50, height: 30, length: 20, mass: 15,
 *   bulky: false, heavy: false, fragile: true
 * };
 *
 * console.log(engine.evaluate(packageData)); // "FRAGILE_HANDLING"
 */

/**
 * @example <caption>Dynamic Rule Management</caption>
 *
 * const { RuleEngine, CLASSIFICATION_RULES } = require('./packageSorting');
 *
 * // Start with default rules
 * const engine = new RuleEngine([...CLASSIFICATION_RULES]);
 *
 * // Add express shipping rule
 * engine.addRule({
 *   name: "express-packages",
 *   condition: (pkg) => pkg.express === true,
 *   result: "EXPRESS",
 *   priority: 0 // Highest priority
 * });
 *
 * // Add temperature-controlled rule
 * engine.addRule({
 *   name: "temperature-controlled",
 *   condition: (pkg) => pkg.temperatureSensitive === true,
 *   result: "CLIMATE_CONTROLLED",
 *   priority: 0.5
 * });
 *
 * // Remove standard rule to make system more restrictive
 * engine.removeRule("standard-packages");
 *
 * // Test with various package types
 * const expressPackage = {
 *   width: 30, height: 20, length: 10, mass: 5,
 *   bulky: false, heavy: false, express: true
 * };
 * console.log(engine.evaluate(expressPackage)); // "EXPRESS"
 */

/**
 * @example <caption>Complex Multi-Criteria Rules</caption>
 *
 * const { RuleEngine } = require('./packageSorting');
 *
 * const complexRules = [
 *   {
 *     name: "hazardous-oversized",
 *     condition: (pkg) => pkg.hazardous && (pkg.bulky || pkg.heavy),
 *     result: "HAZMAT_SPECIAL",
 *     priority: 1
 *   },
 *   {
 *     name: "international-restricted",
 *     condition: (pkg) => pkg.international && pkg.restricted,
 *     result: "CUSTOMS_HOLD",
 *     priority: 2
 *   },
 *   {
 *     name: "high-value-small",
 *     condition: (pkg) => pkg.value > 1000 && !pkg.bulky && !pkg.heavy,
 *     result: "SECURE_SMALL",
 *     priority: 3
 *   },
 *   {
 *     name: "bulk-discount",
 *     condition: (pkg) => pkg.quantity > 50 && pkg.bulky,
 *     result: "BULK_PROCESSING",
 *     priority: 4
 *   },
 *   {
 *     name: "default-processing",
 *     condition: (pkg) => true,
 *     result: "STANDARD",
 *     priority: 5
 *   }
 * ];
 *
 * const complexEngine = new RuleEngine(complexRules);
 *
 * // Test complex package
 * const complexPackage = {
 *   width: 200, height: 100, length: 50, mass: 30,
 *   bulky: true, heavy: true, hazardous: true,
 *   international: false, restricted: false,
 *   value: 500, quantity: 1
 * };
 *
 * console.log(complexEngine.evaluate(complexPackage)); // "HAZMAT_SPECIAL"
 */

/**
 * @example <caption>Integration with External Configuration</caption>
 *
 * // rules-config.json
 * // {
 * //   "rules": [
 * //     {
 * //       "name": "premium-service",
 * //       "condition": "pkg => pkg.serviceLevel === 'premium'",
 * //       "result": "PREMIUM",
 * //       "priority": 1
 * //     }
 * //   ]
 * // }
 *
 * const fs = require('fs');
 * const { RuleEngine } = require('./packageSorting');
 *
 * // Load rules from external configuration
 * function loadRulesFromConfig(configPath) {
 *   const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
 *
 *   return config.rules.map(rule => ({
 *     ...rule,
 *     // Convert string condition to function (be careful with eval in production!)
 *     condition: new Function('pkg', `return ${rule.condition}`)
 *   }));
 * }
 *
 * // Usage
 * // const externalRules = loadRulesFromConfig('./rules-config.json');
 * // const engine = new RuleEngine(externalRules);
 */
