export interface Snack {
  id: string;
  name: string;
  image: string;
}

export async function fetchSnacks(): Promise<Snack[]> {
  const response = await fetch("/data.json")
  const data = await response.json()
  const { snacks } = data
  return Promise.resolve(snacks)
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}