'use client'

import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'
import { useParams } from 'next/navigation'
import { Details } from '@/components/details'
import { TbPlayerTrackNext, TbPlayerTrackPrev } from 'react-icons/tb'
import { MenuBar } from '@/components/MenuBar'

type PokemonsProps = {
  id: string
  name: string
  image: string
  secondImage: string
  abilities: PokemonData['abilities']
  height: number
  weight: number
  stats: PokemonData['stats']
  experience: number
  pokemonType: string[]
  chainEvolutions: evolutionProps[]
}

type evolutionProps = {
  name: string
  imgs: string[]
}

const requestCache = new Map<string, any>() // Cache para armazenar requisições

async function cachedFetch(url: string) {
  if (requestCache.has(url)) {
    return requestCache.get(url)
  }
  const response = await fetch(url, {
    next: {
      revalidate: 60 * 60 * 24 * 30 * 7,
      tags: ['pokemon-evolution']
    }
  })
  const data = await response.json()
  requestCache.set(url, data)
  return data
}

async function evolutionsList(url: string) {
  try {
    const response = await cachedFetch(url)
    const chain = response.chain

    const evolutions: string[] = []
    let current = chain
    while (current) {
      evolutions.push(current.species.name)
      current = current.evolves_to[0] || null
    }
    return evolutions
  } catch (error) {
    console.error(error)
    return []
  }
}

async function handleSearchPokemonEvolution(name: string) {
  try {
    const speciesData = await cachedFetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    )
    const evolutions = await evolutionsList(speciesData.evolution_chain.url)

    const evolutionPromises = evolutions.map(async evolution => {
      const evolutionData = await cachedFetch(
        `https://pokeapi.co/api/v2/pokemon/${evolution}`
      )

      const evolutionImages = [
        evolutionData.sprites?.other.dream_world.front_default,
        evolutionData.sprites?.other['official-artwork'].front_default,
        evolutionData.sprites?.other['home'].front_default,
        evolutionData.sprites?.front_default
      ]
      return {
        name: evolution,
        imgs: evolutionImages
      }
    })

    return await Promise.all(evolutionPromises)
  } catch (error) {
    console.error(error)
    return []
  }
}

export default function PokemonDetails() {
  const { pokemonDetails } = useParams()
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)
  const [currentId, setCurrentId] = useState<string>(pokemonDetails!.toString()) // ID inicial
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearchPokemons(id: string) {
    setIsLoading(true)
    try {
      const data = await cachedFetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const chainEvolution = await handleSearchPokemonEvolution(data.name)

      const typesNames = data.types.map((item: any) => item.type.name)

      const pokemonData: PokemonsProps = {
        id: data.id,
        name: data.name,
        image: data.sprites?.other.dream_world.front_default,
        secondImage: data.sprites?.other['official-artwork'].front_default,
        abilities: data.abilities,
        height: data.height,
        weight: data.weight,
        stats: data.stats,
        experience: data.base_experience,
        pokemonType: typesNames,
        chainEvolutions: chainEvolution
      }

      setCurrentId(data.id)
      setPokemon(pokemonData)
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if ((Number(currentId) ?? 0) < 1010) {
      // Limite máximo de Pokémons
      setCurrentId(prev => (Number(prev) + 1).toString())
    }
  }

  const handlePrevious = () => {
    if ((Number(currentId) ?? 0) > 1) {
      // Limite mínimo
      setCurrentId(prev => (Number(prev) - 1).toString())
    }
  }

  useEffect(() => {
    console.log(isLoading)
    if (isLoading) handleSearchPokemons(pokemonDetails!.toString())
    handleSearchPokemons(currentId.toString())
  }, [currentId])

  return (
    <main className="flex gap-4 items-start w-full">
      <MenuBar />

      <section>
        <Details
          onEvolutionClick={(name: string) => handleSearchPokemons(name)}
          isLoading={isLoading}
          key={pokemon.id}
          id={pokemon.id}
          image={pokemon.image}
          secondImage={pokemon.secondImage}
          name={pokemon.name}
          evolutions={pokemon.chainEvolutions}
          experience={pokemon.experience}
          height={pokemon.height}
          weight={pokemon.weight}
          stats={pokemon.stats}
          pokemonAbilities={pokemon.abilities}
          pokemonType={pokemon.pokemonType}
        />
        <div className="flex items-center w-full max-w-4xl justify-between">
          <button
            onClick={handlePrevious}
            disabled={Number(currentId) === 1}
            className={`btn ${Number(currentId) === 1 ? 'btn-disabled' : 'btn-primary'} 
          flex items-center gap-2 border p-1 rounded-full bg-gray-100 hover:bg-gray-200`}
            title={pokemon.name}
          >
            <TbPlayerTrackPrev />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={Number(currentId) === 1010}
            className={`btn ${
              Number(currentId) === 1010 ? 'btn-disabled' : 'btn-primary'
            } 
          flex items-center gap-2 border p-1 rounded-full bg-gray-100 hover:bg-gray-200`}
            title={pokemon.name}
          >
            Next
            <TbPlayerTrackNext />
          </button>
        </div>
      </section>
    </main>
  )
}
