'use client'
type PaginationProps = {
  count: string
  next: string
  previous: string | null
  results: PokemonsPAginate[]
}

type PokemonsPAginate = {
  name: string
  url: string
}

export async function fetchPokemonPagination(offset: number = 0, limit: number = 9) {
  const data = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  )
  const response: PaginationProps = await data.json()
  const { count, next, previous, results } = response
  return {
    count,
    next,
    previous,
    results
  }
}