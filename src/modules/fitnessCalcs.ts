export function caloriesBurned(
  lbs: number,
  minutes: number,
  MET: number
): number {
  const kg = lbs * 0.453592;
  const hours = minutes / 60;
  const calories = MET * kg * hours;
  return calories;
}
