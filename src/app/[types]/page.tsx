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
  pokemonType: string[]
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
      const typesNames = pokemonIndex.types.map(item => item.type.name)

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
          pokemonType: typesNames,
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
