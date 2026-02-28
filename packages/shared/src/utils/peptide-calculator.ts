import { INSULIN_SYRINGE_UNITS } from '../constants/peptide-calculator';

// ---------------------------------------------------------------------------
// Pure calculation helpers for peptide reconstitution
// ---------------------------------------------------------------------------

/**
 * Concentration after reconstituting a vial.
 * @param mgTotal  Total peptide mass in vial (mg)
 * @param mlDiluent  Volume of bacteriostatic water added (ml)
 * @returns Concentration in mg/ml
 */
export function calculateConcentration(
  mgTotal: number,
  mlDiluent: number,
): number {
  if (mlDiluent <= 0) {
    throw new RangeError('mlDiluent must be greater than 0');
  }
  return mgTotal / mlDiluent;
}

/**
 * How many micrograms each syringe unit delivers.
 * @param mgTotal  Total peptide mass in vial (mg)
 * @param mlDiluent  Volume of bacteriostatic water added (ml)
 * @returns Micrograms per insulin syringe unit
 */
export function calculateMcgPerUnit(
  mgTotal: number,
  mlDiluent: number,
): number {
  const concentrationMgPerMl = calculateConcentration(mgTotal, mlDiluent);
  const totalMcg = concentrationMgPerMl * 1000; // mcg per ml
  return totalMcg / INSULIN_SYRINGE_UNITS;
}

/**
 * Number of syringe units to draw for a desired dose.
 * @param desiredMcg  Target dose in micrograms
 * @param mgTotal  Total peptide mass in vial (mg)
 * @param mlDiluent  Volume of bacteriostatic water added (ml)
 * @returns Units to draw on insulin syringe (may be fractional)
 */
export function calculateUnitsForDose(
  desiredMcg: number,
  mgTotal: number,
  mlDiluent: number,
): number {
  const mcgPerUnit = calculateMcgPerUnit(mgTotal, mlDiluent);
  if (mcgPerUnit <= 0) {
    throw new RangeError('mcgPerUnit must be greater than 0');
  }
  return desiredMcg / mcgPerUnit;
}
