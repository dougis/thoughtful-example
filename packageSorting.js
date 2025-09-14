// Package Sorting Module
// Classifies packages based on dimensions and mass for robotic automation

// Classification threshold constants
const VOLUME_THRESHOLD = 1000000; // cm³
const DIMENSION_THRESHOLD = 150; // cm
const MASS_THRESHOLD = 20; // kg

// Stack name constants
const STANDARD = "STANDARD";
const SPECIAL = "SPECIAL";
const REJECTED = "REJECTED";

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
 * Sorts packages into appropriate stacks based on dimensions and mass
 * @param {number} width - Package width in centimeters
 * @param {number} height - Package height in centimeters
 * @param {number} length - Package length in centimeters
 * @param {number} mass - Package mass in kilograms
 * @returns {string} Stack name: "STANDARD", "SPECIAL", or "REJECTED"
 */
function sort(width, height, length, mass) {
  const bulky = isBulky(width, height, length);
  const heavy = isHeavy(mass);

  // Decision matrix logic:
  // - Neither bulky nor heavy: STANDARD
  // - Bulky but not heavy: SPECIAL
  // - Heavy but not bulky: SPECIAL
  // - Both bulky and heavy: REJECTED
  if (bulky && heavy) {
    return REJECTED;
  } else if (bulky || heavy) {
    return SPECIAL;
  } else {
    return STANDARD;
  }
}

module.exports = {
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD,
  STANDARD,
  SPECIAL,
  REJECTED,
  isBulky,
  isHeavy,
  sort,
};
