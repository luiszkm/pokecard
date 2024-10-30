'use client'
import { Ability as Ability_type } from '@/@types/abilities'
import { useEffect, useState } from 'react'
import { GiAlliedStar } from 'react-icons/gi'
type AbilityProps = {
  abilityName: string
  effect?: string
  short_effect?: string
}
type Abilities = {
  abilities: PokemonAbilities[]
}

type PokemonAbilities = {
  ability: {
    name: string
    url: string
  }
}
export function Ability({ abilities }: Abilities) {
  const [ability, setAbility] = useState <AbilityProps[]>([] as AbilityProps[])
      
 useEffect(() => {
  setAbility([]);
  abilities?.forEach(item => {
    fetchPokemonAbilities(item.ability.url);
  });

  async function fetchPokemonAbilities(url: string) {
    const data = await fetch(url);
    const response: Ability_type = await data.json();
    
    const pokemonAbilities: AbilityProps = {
      abilityName: response.name,
      effect: response.effect_entries.find(item => item.language.name === 'en')?.effect,
      short_effect: response.effect_entries.find(item => item.language.name === 'en')?.short_effect
    };
        
    setAbility(prevStat => {
      if (!isDuplicate(pokemonAbilities, prevStat)) {
        return [...prevStat, pokemonAbilities];
      }
      return prevStat;
    });
  }
}, []);

function isDuplicate(newAbility: AbilityProps, abilities: AbilityProps[]): boolean {
  return abilities.some(ability => ability.abilityName === newAbility.abilityName);
}

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 "
    
    >
      {ability &&
        ability.map((item, index) => (
          <div className='flex flex-col items-start p-2 border rounded-lg w-80 shadow animate-fade-down animate-once'
      
          key={index} title={item.short_effect}>
            <strong className='flex items-center gap-2'> <GiAlliedStar />{item.abilityName}:</strong>
           <p className='text-sm font-normal h-28 
          overflow-y-auto animate-fade-right animate-once
          [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'> {item.effect}</p>
          </div>
        ))}
    </div>
  )
}
