// ---------------------------------------------------------------------------
// Peptide reconstitution constants
// ---------------------------------------------------------------------------

/** Total units on a standard insulin syringe (U-100) */
export const INSULIN_SYRINGE_UNITS = 100 as const;

/** Common bacteriostatic water volumes (ml) for reconstitution */
export const STANDARD_BAC_WATER_ML = [1, 1.5, 2, 2.5, 3, 5] as const;

// ---------------------------------------------------------------------------
// Calculator input / output types
// ---------------------------------------------------------------------------

export interface ReconstitutionInput {
  /** Total peptide in the vial (mg) */
  readonly mgTotal: number;
  /** Volume of bacteriostatic water added (ml) */
  readonly mlDiluent: number;
  /** Desired dose per injection (mcg) */
  readonly desiredMcg: number;
}

export interface ReconstitutionOutput {
  /** Concentration after mixing (mg/ml) */
  readonly concentrationMgPerMl: number;
  /** Micrograms per syringe unit */
  readonly mcgPerUnit: number;
  /** Number of syringe units to draw for the desired dose */
  readonly unitsForDose: number;
  /** Volume to draw (ml) */
  readonly mlForDose: number;
}
