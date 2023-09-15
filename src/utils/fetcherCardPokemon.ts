'use client'
import { EvolutionChain } from "@/@types/evolution"
import { PokemonData } from "@/@types/pokeapi"
import { useEffect, useState } from "react"

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
  pokemonType: PokemonData['types']
}

type EvolutionProps = EvolutionChain
type fetcherCardPokemonProps = {
 params: string
}

export function  fetcherCardPokemon ({params}: fetcherCardPokemonProps){
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)

  const [evolution, setEvolution] = useState('')
  async function handleSearchPokemons() {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${params}`)
    const response: PokemonData = await data.json()
    setPokemon({} as PokemonsProps)
    const pokemon = {
      id: response.id,
      name: response.name,
      image: response.sprites?.other.dream_world.front_default,
      secondImage: response.sprites?.other['official-artwork'].front_default,
      abilities: response.abilities,
      height: response.height,
      weight: response.weight,
      stats: response.stats,
      experience: response.base_experience,
      pokemonType: response.types
    }
    console.log(pokemon.image);
    
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
    const evolution: EvolutionProps = await data.json()
    verifyEvolution(evolution, id)
  }
  async function handleEvolutionPokemon(name: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const response: PokemonData = await data.json()
    if(response.sprites?.other.dream_world.front_default === null) {

      setEvolution(response.sprites?.other['official-artwork'].front_default)
      return
    }
    setEvolution(response.sprites?.other.dream_world.front_default)
  }
  function verifyEvolution(evo: EvolutionProps, id: number) {
    const evo2 = id + 1
    
    if (evo.chain.evolves_to.length === 0) {
      
      return
    }
    const evo2Url = evo.chain.evolves_to[0].species.url.split('/')
    const id_evo2 = Number(evo2Url[evo2Url.length - 2])
    
    if (id_evo2 === evo2 || id_evo2 === id) {

      return handleEvolutionPokemon(evo.chain.evolves_to[0]?.species.name)
    }
    if (id === id_evo2) {
      return handleEvolutionPokemon(
        evo.chain.evolves_to[0].evolves_to[0].species.name
      )
    }

    if (evo.chain.evolves_to[0].evolves_to.length === 0) {
      return
    }
    const evo3URL =
      evo.chain.evolves_to[0]?.evolves_to[0].species.url.split('/')
    const id_evo3 = Number(evo3URL[evo3URL.length - 2])
    if (id === id_evo3) {
      return
    }
    return handleEvolutionPokemon(evo.chain.evolves_to[0].species.name)
  }
  const evolutionPokemon = pokemon.image === null ? evolution : pokemon.image

  return {handleSearchPokemons }
}