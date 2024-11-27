'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/card';
import { Pagination } from '@/components/Pagination';
import { useParams } from 'next/navigation';
import { PokemonData, Pokemontypes } from '@/@types/pokeapi';

const paginate = 9 // Número de itens por página

type PokemonProps = {
  id: number;
  name: string;
  image: string;
  secondImage: string;
  abilities: PokemonData['abilities'];
  height: number;
  weight: number;
  stats: PokemonData['stats'];
  experience: number;
  pokemonType: string[];
};

export default function Types() {
  const { types } = useParams();
  const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonData = async (url: string): Promise<PokemonProps | null> => {
    try {
      const response = await fetch(url);
      const data: PokemonData = await response.json();

      const hasImage =
        data.sprites?.other.dream_world.front_default ||
        data.sprites?.other['official-artwork'].front_default ||
        data.sprites?.front_default;

      if (!hasImage) return null;
      const imagePrimary =
          data.sprites?.other.dream_world.front_default ||
          data.sprites?.other['official-artwork'].front_default;
      
      return {
        id: data.id,
        name: data.name,
        image: imagePrimary,
        secondImage: data.sprites?.front_default,
        abilities: data.abilities,
        height: data.height,
        weight: data.weight,
        stats: data.stats,
        experience: data.base_experience,
        pokemonType: data.types.map((type) => type.type.name),
      };
    } catch (err) {
      console.error('Error fetching Pokémon:', err);
      return null;
    }
  };

  const fetchPokemonsByType = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.POKE_API_TYPE}/${types}`);
      const data: Pokemontypes = await response.json();

      const pokemonsData = await Promise.all(
        data.pokemon.map(({ pokemon }) => fetchPokemonData(pokemon.url))
      );

      const validPokemons = pokemonsData.filter(Boolean) as PokemonProps[];
      
      setPokemons(validPokemons);

      // Corrige o cálculo de totalPages baseado no número total de Pokémons válidos
      setTotalPages(Number(validPokemons.length));
    } catch (err) {
      setError('Failed to load Pokémon data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedPokemons = () => {
    const startIndex = (currentPage - 1) * paginate;
    return pokemons.slice(startIndex, startIndex + paginate);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  useEffect(() => {
    fetchPokemonsByType();
  }, [types]);

  return (
    <main className="flex flex-col items-center gap-3">
      {error && <p className="text-red-500">{error}</p>}
      <section className="grid gap-3 md:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          paginatedPokemons().map((pokemon) => (
            <Card
              key={pokemon.id}
              isLoading={isLoading}
              id={pokemon.id}
              image={pokemon.image}
              secondImage={pokemon.secondImage}
              name={pokemon.name}
              prevEvolution={''} // Pode ser ajustado se necessário
              experience={pokemon.experience}
              height={pokemon.height}
              weight={pokemon.weight}
              stats={pokemon.stats}
              pokemonAbilities={pokemon.abilities}
              pokemonType={pokemon.pokemonType}
            />
          ))
        )}
      </section>
      {!isLoading && totalPages > 1 && (
        <Pagination pageLength={totalPages} onPageChange={handlePageChange} />
      )}
    </main>
  );
}
