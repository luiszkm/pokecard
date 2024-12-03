'use client'

import { useEffect, useState } from 'react'
import { PokemonData, PokemonPaginated } from '@/@types/pokeapi'
import { Card } from '@/components/card'
import { Pagination } from '@/components/Pagination'
import { MenuBar } from '@/components/MenuBar'

type PokemonsProps = {
  id: number
  name: string
  image: string
  secondImage: string
  abilities: PokemonData['abilities']
  height: number
  weight: number
  stats: PokemonData['stats']
  experience: number
  pokemonType: string[]
  pokemonEvolution: string
}

const paginate = 9

export default function Pokemons() {
  const [pokemonPaginated, setPokemonPaginated] = useState<PokemonsProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const totalPages = 1293

  const fetchPokemonData = async (offset: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${paginate}`,
        {
          next: { revalidate: 60 * 60 * 24 * 30, tags: ['pokemons'] }
        }
      )
      const { results }: PokemonPaginated = await res.json()
      const pokemonDetails = await fetchPokemonsDetails(results.map(p => p.url))

      const pokemons = pokemonDetails.map(pokemon => {
        const imagePrimary =
          pokemon.sprites?.other.dream_world.front_default ||
          pokemon.sprites?.other['official-artwork'].front_default

        return {
          id: pokemon.id,
          name: pokemon.name,
          image: imagePrimary,
          secondImage: pokemon.sprites?.front_default,
          abilities: pokemon.abilities,
          height: pokemon.height,
          weight: pokemon.weight,
          stats: pokemon.stats,
          experience: pokemon.base_experience,
          pokemonType: pokemon.types.map(
            (t: { type: { name: any } }) => t.type.name
          ),
          pokemonEvolution: ''
        }
      })

      setPokemonPaginated(pokemons)
    } catch (error) {
      console.error('Error fetching Pokémon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPokemonsDetails = async (urls: string[]) => {
    const promises = urls.map(url => fetch(url).then(res => res.json()))

    try {
      const responses = await Promise.all(promises)
      return responses.filter(
        response =>
          response.sprites?.other.dream_world.front_default ||
          response.sprites?.other['official-artwork'].front_default
      )
    } catch (error) {
      console.error('Error fetching details:', error)
      return []
    }
  }

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * paginate
    fetchPokemonData(offset)
  }

  useEffect(() => {
    fetchPokemonData(0)
  }, [])

  return (
    <main className="flex items-start gap-3 p-4">
      <MenuBar />

      <section className="flex flex-col items-center gap-4">
        <div  className="grid gap-3 md:grid-cols-3 sm:grid-cols-2 ">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          pokemonPaginated.map(pokemon => (
            <Card
              isLoading={false}
              key={`${pokemon.image}`}
              id={pokemon.id}
              image={pokemon.image}
              secondImage={pokemon.secondImage}
              name={pokemon.name}
              prevEvolution={pokemon.pokemonEvolution}
              experience={pokemon.experience}
              height={pokemon.height}
              weight={pokemon.weight}
              stats={pokemon.stats}
              pokemonAbilities={pokemon.abilities}
              pokemonType={pokemon.pokemonType}
            />
          ))
        )}
        </div>
        
        <Pagination pageLength={totalPages} onPageChange={handlePageChange} />
      </section>
    </main>
  )
}
