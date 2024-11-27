'use client'

import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'
import { useParams, useRouter } from 'next/navigation'
import { Details } from '@/components/details'

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
      tags: ['pokemon-evolution'],
    },
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

    const evolutionPromises = evolutions.map(async (evolution) => {
      const evolutionData = await cachedFetch(
        `https://pokeapi.co/api/v2/pokemon/${evolution}`
      )

      const evolutionImages = [
        evolutionData.sprites?.other.dream_world.front_default,
        evolutionData.sprites?.other['official-artwork'].front_default,
        evolutionData.sprites?.other['home'].front_default,
        evolutionData.sprites?.front_default,
      ]
      return {
        name: evolution,
        imgs: evolutionImages,
      }
    })

    return await Promise.all(evolutionPromises)
  } catch (error) {
    console.error(error)
    return []
  }
}

export default function PokemonDetails() {
  const {pokemonDetails} = useParams()
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)
  const [currentId, setCurrentId] = useState(Number(pokemonDetails)) // ID inicial
  const [isLoading, setIsLoading] = useState(false)

  const {}= useRouter()
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
        chainEvolutions: chainEvolution,
      }
      
      setCurrentId(data.id);
      //setEvolutionIndex(0); // Resetar o índice de evolução
      setPokemon(pokemonData)
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error)
    } finally {
      setIsLoading(false)
      
    }
  }

  const handleNext = () => {
    if (currentId < 1010) { // Limite máximo de Pokémons
      setCurrentId((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentId > 1) { // Limite mínimo
      setCurrentId((prev) => prev - 1)
    }
  }

  useEffect(() => {
    handleSearchPokemons(currentId.toString())
  }, [currentId])

  return (
    <main className="space-y-3">
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
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentId === 1}
          className={`btn ${currentId === 1 ? 'btn-disabled' : 'btn-primary'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentId === 1010}
          className={`btn ${currentId === 1010 ? 'btn-disabled' : 'btn-primary'}`}
        >
          Next
        </button>
      </div>
    </main>
  )
}
