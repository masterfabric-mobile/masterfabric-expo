/**
 * Cooking guide models — step display and optional timer/notes.
 * Steps are 1-based index for UI; data comes from recipe.steps (string[]).
 */

export interface CookingStepDisplay {
  /** 1-based step number */
  stepNumber: number;
  /** Step instruction text */
  text: string;
  /** Optional duration in seconds (for future timer) */
  durationSeconds?: number;
}

export interface CookingGuideState {
  /** Current 1-based step index (1 .. totalSteps) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** User notes per step index (0-based key) */
  stepNotes: Record<number, string>;
}
