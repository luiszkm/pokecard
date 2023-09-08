'use client'

import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'

type PokemonsProps = {
  id: number
  name: string
  image: string
  ability: PokemonData['abilities']
  height: number
  weight: number
  stats: PokemonData['stats']
  experience: number
  pokemonType: PokemonData['types']
}

export default function Pokemons() {
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)
  async function handleSearchPokemons() {
    const data = await fetch('https://pokeapi.co/api/v2/pokemon/4')
    const response: PokemonData = await data.json()
    const pokemon = {
      id: response.id,
      name: response.name,
      image: response.sprites?.other.dream_world.front_default,
      ability: response.abilities,
      height: response.height,
      weight: response.weight,
      stats: response.stats,
      experience: response.base_experience,
      pokemonType: response.types
    }
    setPokemon(pokemon)

    handleSearchPokemonEvolution(response.id)
  }
  async function handleSearchPokemonEvolution(id: number) {
    let response
    {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      )
       response = await data.json()
    }
    const data = await fetch(response.evolution_chain.url)
    const evolution = await data.json()
    console.log(evolution);
    
  }

  // console.log(pokemon)
  useEffect(() => {
    handleSearchPokemons()
  }, [])
  return (
    <main className="space-y-3">
      <div className="w-96">
        <div className="flex  items-center gap-5 justify-between">
          <p>#{pokemon.id}</p>
          <h2>{pokemon.name} </h2>
          <span>Xp {pokemon.experience}</span>
        </div>
        <div>
          <img src={pokemon.image} alt="" />
        </div>
        <div>
          <div className="flex flex-col items-start gap-2">
            Habilidades :
            {pokemon.ability &&
              pokemon.ability.map(item => {
                return <span key={item.ability.name}>{item.ability.name}</span>
              })}
          </div>
          <div className="flex items-center gap-2">
            <strong>tipo:</strong>
            {pokemon.pokemonType &&
              pokemon.pokemonType.map(item => item.type.name)}
          </div>
          <div>
            <strong>Status:</strong>
            {pokemon.stats &&
              pokemon.stats.map(item => (
                <div key={item.stat.name}>
                  <span>{item.stat.name} </span>
                  <span>{item.base_stat}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
