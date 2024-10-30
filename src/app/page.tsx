'use client'

import { useEffect, useState } from 'react'
import { PokemonData, PokemonPaginated } from '@/@types/pokeapi'
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


const paginate = 9

export default function Pokemons() {
  const [pokemonPaginated, setPokemonPaginated] = useState<PokemonsProps[]>([])
  const totalPages = 1293
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearchPokemonsPaginated(pagRendered: number
  ) {
    setIsLoading(true) // Indica que a busca está em andamento
    try {
      const data = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=${pagRendered}&limit=9`,{
          next: {
            revalidate: 60 * 60 * 24 * 30 * 7,
            tags: ['pokemons']
        }
    })
      const response: PokemonPaginated = await data.json()
      
      const pokemontypesList = response.results
      let totalPokemonsTypesWithImages : PokemonData[] = []
    for (const pokemon of pokemontypesList) {
      
      try {
        const data = await fetch(`${pokemon.url}`, {
          next: {
            revalidate: 60 * 60 * 24 * 30,
            tags: ['pokemons']
          }
        })
        const response: PokemonData = await data.json()
        const hasImage = response.sprites?.other.dream_world.front_default ||
        response.sprites?.other['official-artwork'].front_default ||
        response.sprites?.other['home'].front_default ||
        response.sprites?.front_default 
        if (hasImage !== null ) {
            totalPokemonsTypesWithImages.push(response)
        }

      } catch (error) {}
    }
   
    
    let pokemonList : PokemonsProps[] = []
      for(const pokemonIndex  of totalPokemonsTypesWithImages){
        try {
          setIsLoading(true)
          if(pokemonIndex){

            const imagePrimary = pokemonIndex.sprites?.other.dream_world.front_default ||  pokemonIndex.sprites?.other['official-artwork'].front_default
            

            const pokemon = {
              id: pokemonIndex.id,
              name: pokemonIndex.name,
              image:   imagePrimary ,
              secondImage:
              pokemonIndex.sprites?.front_default || pokemonIndex.sprites?.other['home'].front_default,
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
      setIsLoading(false) // Indica que a busca foi concluída
    } catch (error) {
      console.log('error', error)
      setIsLoading(false) // Indica que ocorreu um erro durante a busca
    }
  }

  const handlePageChange = (page: number) => {
    const pagination = page * paginate
    const pagRender = Number(page - 1) * paginate
    handleSearchPokemonsPaginated( pagRender)
  }

  useEffect(() => {
    console.log(paginate);
    
    handleSearchPokemonsPaginated(0)
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
