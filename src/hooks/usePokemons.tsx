import { useState } from 'react';
import { PokemonData, Pokemontypes } from '@/@types/pokeapi';

export const usePokemons = (paginate: number) => {
  const [pokemonPaginated, setPokemonPaginated] = useState<PokemonData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonsByType = async (type: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.POKE_API_TYPE}/${type}`);
      const data: Pokemontypes = await response.json();

      const pokemons = await Promise.all(
        data.pokemon.map(async ({ pokemon }) => {
          try {
            const res = await fetch(pokemon.url);
            const pokemonData: PokemonData = await res.json();

            const hasImage =
              pokemonData.sprites?.other.dream_world.front_default ||
              pokemonData.sprites?.other['official-artwork'].front_default ||
              pokemonData.sprites?.front_default;

            return hasImage ? pokemonData : null;
          } catch {
            return null;
          }
        })
      );

      const validPokemons = pokemons.filter(Boolean) as PokemonData[];
      
      setTotalPages(Math.ceil(validPokemons.length / paginate));
      return validPokemons;
    } catch (err) {
      setError('Failed to fetch Pokémon data. Please try again.');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const paginateList = (list: PokemonData[], page: number): PokemonData[] => {
    const start = (page - 1) * paginate;
    return list.slice(start, start + paginate);
  };

  return {
    pokemonPaginated,
    setPokemonPaginated,
    totalPages,
    isLoading,
    error,
    fetchPokemonsByType,
    paginateList,
  };
};
