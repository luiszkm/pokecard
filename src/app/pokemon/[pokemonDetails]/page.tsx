'use client'
import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'
import { PokemonSpecies } from '@/@types/evolution'
import { useParams } from 'next/navigation'
import { Details } from '@/components/details'
import { CarouselComponent } from '@/components/CarouselCardDetails'

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
  chainEvolutions: evolutionProps[]
}



type evolutionProps = {
  name: string
  imgs: string[]
}

export default function PokemonDetails() {
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)
  const { pokemonDetails } = useParams()

  async function handleSearchPokemons() {
    setPokemon({} as PokemonsProps)
    const data = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonDetails}`
    )
    const response: PokemonData = await data.json()
    const chainEvolution =
      (await handleSearchPokemonEvolution(response.name)) || []

    const typesNames = response.types.map(item => item.type.name)
    console.log(typesNames);
    
    const pokemon: PokemonsProps = {
      id: response.id,
      name: response.name,
      image: response.sprites?.other.dream_world.front_default,
      secondImage: response.sprites?.other['official-artwork'].front_default,
      abilities: response.abilities,
      height: response.height,
      weight: response.weight,
      stats: response.stats,
      experience: response.base_experience,
      pokemonType: typesNames,
      chainEvolutions: chainEvolution,
    }
    setPokemon(pokemon)
  }
  async function handleSearchPokemonEvolution(name: string) {
    try {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`,
        {
          next: {
            revalidate: 60 * 60 * 24 * 30 * 7,
            tags: ['pokemon-evolution']
          }
        }
      )
      const response: PokemonSpecies = await data.json()
      const evolutions = await evolutionsList(response.evolution_chain.url)

      const evolutionPromises = evolutions!.map(async evolution => {
        const data = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${evolution}`
        )
        const response: PokemonData = await data.json()

        const evolutionImages = [
          response.sprites?.other.dream_world.front_default,
          response.sprites?.other['official-artwork'].front_default,
          response.sprites?.other['home'].front_default,
          response.sprites?.front_default
        ]
        return {
          name: evolution,
          imgs: evolutionImages
        }
      })

      const imagesEvolutions = await Promise.all(evolutionPromises)
      return imagesEvolutions
    } catch (error) {
      console.log(error)
    }
  }
  async function evolutionsList(url: string) {
    try {
      const data = await fetch(url, {
        next: {
          revalidate: 60 * 60 * 24 * 30 * 7,
          tags: ['pokemon-evolution']
        }
      })
      const response = await data.json()
      const mainPokemon = response.chain.species.name
      const evolutionOne = response.chain.evolves_to[0]?.species.name || ''
      const evolutionTwo =
        response.chain.evolves_to[0]?.evolves_to[0]?.species.name || ''
      return [mainPokemon, evolutionOne, evolutionTwo]
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSearchPokemons()
  }, [])
  return (
    <main className="space-y-3">
      <Details
        isLoading={false}
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
    </main>
  )
}
