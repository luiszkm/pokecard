'use client'

import { useEffect, useState } from 'react'
import { PokemonData } from '@/@types/pokeapi'
import { EvolutionChain } from '@/@types/evolution'
import { Card } from '@/components/card'
import { Pagination } from '@/components/Pagination'



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
  pokemonEvolution: string
}
type PokemonAbilities = {
  abilityName: string
  effect?: string
  short_effect?: string
}

type EvolutionProps = EvolutionChain
const  paginate = 9

export default function Pokemons() {
  const [findPokemon, setFindPokemon] = useState('22')
  const [pokemonPaginated, setPokemonPaginated] = useState<PokemonsProps[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  async function handleSearchPokemons(params: string = '1') {
   
  }
  
  async function handleSearchPokemonsPaginated(
    paginetd: number,
    pagRendered: number
  ) {
    var pokemonList = []
    for (let i = pagRendered; i <= paginetd; i++) {
        try {
          const data = await fetch(`${process.env.POKE_API}/${i}`,{
            next: {
              revalidate: 60 * 60 * 24 * 30,
              tags: ['pokemons']
            },
            cache:  'default'
          })
          const response: PokemonData = await data.json()
    
          const evo = await handleSearchPokemonEvolution(response.id)
    
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
            pokemonType: response.types,
            pokemonEvolution: evo || ''
          }
    
          pokemonList.push(pokemon)
        } catch (error) {
          
        }
    }
    setPokemonPaginated(pokemonList)
    console.log("finalizou");
    
  }

  async function handleSearchPokemonEvolution(id: number) {
    let response
    {
      const data = await fetch(
        `${process.env.POKE_API_EVOLUTION}/${id}`,{
          next: {
            revalidate: 60 * 60 * 24 * 30,
            tags: ['pokemons']
          }
        }
      )
      response = await data.json()
    }
    const data = await fetch(response.evolution_chain.url)
    const evolution: EvolutionProps = await data.json()

    return verifyEvolution(evolution, id)
  }
  async function handleEvolutionPokemon(name: string) {
    const data = await fetch(`${process.env.POKE_API}/${name}`,{
      next: {
        revalidate: 60 * 60 * 24 * 30,
        tags: ['pokemons']
      }
    
    })
    const response: PokemonData = await data.json()

    if (response.sprites?.other.dream_world.front_default === null) {
      return response.sprites?.other['official-artwork'].front_default
    }
    return response.sprites?.other.dream_world.front_default
  }
  function verifyEvolution(evo: EvolutionProps, id: number) {
    const evo2 = id + 1
    const evo3 = id + 2

    if (evo.chain.evolves_to.length === 0) {
      console.log('não evolui')
      return
    }
    const evo2Url = evo.chain.evolves_to[0].species.url.split('/')
    const id_evo2 = Number(evo2Url[evo2Url.length - 2])

    if (id_evo2 === evo2) {
      console.log('evolui v1')

      return handleEvolutionPokemon(evo.chain.evolves_to[0]?.species.name)
    }
    if (id === id_evo2) {
      console.log('evolui v2')
      const evolutionV1 = evo.chain.evolves_to[0].evolves_to[0]?.species.name
      if (evolutionV1 === undefined) {
        return
      }

      return handleEvolutionPokemon(evolutionV1)
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

  const handlePageChange = (page: number) => {
    const pagination = page * paginate
    const pagRender = Number(page - 1) * paginate + 1

    setCurrentPage(page)

    handleSearchPokemonsPaginated(pagination, pagRender)
  }

  useEffect(() => {
  
    handleSearchPokemonsPaginated(paginate, 1)
  }, [])
  return (
    <main className="flex flex-col items-center gap-3">
      <input
        className="bg-zinc-50 placeholder-zinc-700"
        type="text"
        placeholder="pesquise seu pokemon"
        onChange={e => setFindPokemon(e.target.value)}
      />
      <button onClick={() => handleSearchPokemons(findPokemon)}>Search</button>
      
      <section className="grid gap-3 md:grid-cols-3">
        {pokemonPaginated &&
          pokemonPaginated.map(pokemon => (
            <Card
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
          ))}
      </section>

      <Pagination onPageChange={handlePageChange} />
    </main>
  )
}
