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
    abilities?.forEach(item => {
      setAbility([])
      fetchPokemonAbilities(item.ability.url)
    })
    async function fetchPokemonAbilities(url: string) {
      const data = await fetch(url)
      const response: Ability_type = await data.json()
      const pokemonAbilities: AbilityProps = {
        abilityName: response.name,
        effect: response.effect_entries.find(item => item.language.name === 'en')
          ?.effect,
        short_effect: response.effect_entries.find(
          item => item.language.name === 'en'
        )?.short_effect
      }
      setAbility(prevStat =>[...prevStat, pokemonAbilities] )
    }
  },[])
  return (
    <div className="flex flex-wrap items-center gap-3">
      {ability &&
        ability.map((item, index) => (
          <strong className='flex items-center gap-1'
          key={index} title={item.short_effect}>
            <GiAlliedStar />
            {item.abilityName}
          </strong>
        ))}
    </div>
  )
}
