export function sortDescending(nameOne: string, nameTwo: string): number {
  return nameOne === nameTwo ? 0 : (nameOne > nameTwo ? 1 : -1);
}
