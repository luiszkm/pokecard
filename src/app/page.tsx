'use client'

import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'
import { EvolutionChain } from '@/@types/evolution'
import { Card } from '@/components/card'


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
type PokemonAbilities = {
  abilityName: string
  effect?: string
  short_effect?: string
}

type EvolutionProps = EvolutionChain

export default function Pokemons() {
  const [pokemon, setPokemon] = useState<PokemonsProps>({} as PokemonsProps)
  const [evolution, setEvolution] = useState('')
  const [findPokemon, setFindPokemon] = useState('1')

  async function handleSearchPokemons(params: string = '1') {
    setPokemon({} as PokemonsProps)
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${params}`)
    const response: PokemonData = await data.json()
    handleSearchPokemonEvolution(response.id)
    console.log(response);
    
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
    setPokemon(pokemon)
    
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
    if (response.sprites?.other.dream_world.front_default === null) {
      setEvolution(response.sprites?.other['official-artwork'].front_default)
      return
    }
    setEvolution(response.sprites?.other.dream_world.front_default)
  }
  function verifyEvolution(evo: EvolutionProps, id: number) {
    const evo2 = id + 1
    const evo3 = id + 2

    if (evo.chain.evolves_to.length === 0) {
      return
    }
    const evo2Url = evo.chain.evolves_to[0].species.url.split('/')
    const id_evo2 = Number(evo2Url[evo2Url.length - 2])

    if (id_evo2 === evo2 ) {
      return handleEvolutionPokemon(evo.chain.evolves_to[0]?.species.name)
    }
    if (id === id_evo2) {
      return handleEvolutionPokemon(
        evo.chain.evolves_to[0].evolves_to[0]?.species.name
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


  async function handlePagination(event: React.SyntheticEvent) {
    let value = Number(event.currentTarget.textContent) || 0
    const pagination = Number(value - 1) * 9
    handleSearchPokemons(String(pagination))
  }
  useEffect(() => {
    handleSearchPokemons()
  }, [])
  return (
    <main className="space-y-3">
      <input
       className='bg-zinc-50 placeholder-zinc-700'
         type="text" 
         placeholder='pesquise seu pokemon'
         onChange={e => setFindPokemon(e.target.value)} />
      <button onClick={()=>handleSearchPokemons(findPokemon)}>Search</button>

      <Card
        key={pokemon.id}
        id={pokemon.id}
        image={pokemon.image}
        secondImage={pokemon.secondImage}
        name={pokemon.name}
        prevEvolution={evolution}
        experience={pokemon.experience}
        height={pokemon.height}
        weight={pokemon.weight}
        stats={pokemon.stats}
        pokemonAbilities={pokemon.abilities}
        pokemonType={pokemon.pokemonType}
      />

      <div className="flex items-center gap-2">
        {/* <button onClick={handlePagination}>1</button>
        <button onClick={handlePagination}>2</button>
        <button onClick={handlePagination}>3</button> */}
      </div>
    </main>
  )
}
