'use client'
import { Card } from '@/components/card'
import { fetcherCardPokemon } from '@/utils/fetcherCardPokemon'
import { fetchPokemonPagination } from '@/utils/paginationPokemon'
import { useState } from 'react'

export default function Home() {
  const [Pokemons, setPokemons] = useState([])
  const [pokemonCard, setPokemonCard] = useState()
 
  async function handlePagination(event: React.SyntheticEvent) {
    let value = Number(event.currentTarget.textContent) || 0
    const pagination = Number(value - 1) * 9
    const result = await fetchPokemonPagination(pagination)
    const {handleSearchPokemons} =  fetcherCardPokemon({ params: '2' })
  
      
    
  }

  return (
    <main>
      {/* {Pokemons &&
        Pokemons.map(i => (
          <Card
            key={pokemon.id}
            id={pokemon.id}
            image={evolutionPokemon}
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
        ))} */}

      <div className="flex items-center gap-2">
        <button onClick={handlePagination}>1</button>
        <button onClick={handlePagination}>2</button>
        <button onClick={handlePagination}>3</button>
      </div>
    </main>
  )
}
