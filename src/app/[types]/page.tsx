'use client'

import { useEffect, useState } from 'react'
import { PokemonData, Pokemontypes } from '@/@types/pokeapi'
import { EvolutionChain } from '@/@types/evolution'
import { Card } from '@/components/card'
import { Pagination } from '@/components/Pagination'
import { useParams } from 'next/navigation'
import { trace } from 'console'

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
const paginate = 9

export default function Types() {
  const [pokemonPaginated, setPokemonPaginated] = useState<PokemonsProps[]>([])
  const [totalPages, setTotalPage] = useState(55)
  const [isLoading, setIsLoading] = useState(false)

  const { types } = useParams()

  async function handleSearchPokemonsTypesPaginated(
    paginetd: number,
    pagRendered: number
  ) {
    const data = await fetch(`${process.env.POKE_API_TYPE}/${types}`, {
      next: {
        revalidate: 60 * 60 * 24 * 30,
        tags: ['pokemons']
      },
      cache: 'default'
    })
    const response: Pokemontypes = await data.json()
    const pokemontypesList = response.pokemon

    let totalPokemonsTypesWithImages = []
    for (const pokemon of pokemontypesList) {
      try {
        const data = await fetch(`${pokemon.pokemon.url}`, {
          next: {
            revalidate: 60 * 60 * 24 * 30,
            tags: ['pokemons']
          },
          cache: 'default'
        })
        const response: PokemonData = await data.json()
        const hasImage = response.sprites?.other.dream_world.front_default
        if (hasImage !== null &&
          response.sprites?.other['official-artwork'].front_default !== null &&
          response.sprites?.front_default !== null
        ) {
            totalPokemonsTypesWithImages.push(response)
        }

      } catch (error) {}
    }
    
    setTotalPage(totalPokemonsTypesWithImages.length )
    let pokemonList = []

    for (let i = pagRendered; i <= paginetd; i++) {
     try {
      setIsLoading(true)
      const pokemonIndex = totalPokemonsTypesWithImages[i]
      if(pokemonIndex){
        const pokemon = {
          id: pokemonIndex.id,
          name: pokemonIndex.name,
          image: pokemonIndex.sprites?.other.dream_world.front_default || pokemonIndex.sprites?.front_default,
          secondImage:
            pokemonIndex.sprites?.other['official-artwork'].front_default,
          abilities: pokemonIndex.abilities,
          height: pokemonIndex.height,
          weight: pokemonIndex.weight,
          stats: pokemonIndex.stats,
          experience: pokemonIndex.base_experience,
          pokemonType: pokemonIndex.types,
          pokemonEvolution: ''
        }
        pokemonList.push(pokemon)
      }
     
      
      setIsLoading(false)
     } catch (error) {
      }

    }
    setPokemonPaginated(pokemonList)

  
  
  }

  async function handleSearchPokemonEvolution(id: number) {
    let response
    {
      const data = await fetch(`${process.env.POKE_API_EVOLUTION}/${id}`, {
        next: {
          revalidate: 60 * 60 * 24 * 30,
          tags: ['pokemons']
        }
      })
      response = await data.json()
    }

    const data = await fetch(response.evolution_chain.url)
    const evolution: EvolutionProps = await data.json()

    return verifyEvolution(evolution, id)
  }
  async function handleEvolutionPokemon(name: string) {
    const data = await fetch(`${process.env.POKE_API}/${name}`, {
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
    handleSearchPokemonsTypesPaginated(pagination, pagRender)
  }

  useEffect(() => {
    handleSearchPokemonsTypesPaginated(paginate, 1)
  }, [])
  return (
    <main className="flex flex-col items-center gap-3">
      <section className="grid gap-3 md:grid-cols-3">
        {pokemonPaginated &&
          pokemonPaginated.map(pokemon => (
            <Card
              isLoading={isLoading}
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

      <Pagination pageLength={totalPages} onPageChange={handlePageChange} />
    </main>
  )
}
