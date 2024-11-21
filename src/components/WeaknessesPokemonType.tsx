import { useEffect, useState } from 'react'
import { pokemonsTypes } from '@/utils/types'

type PokemonWeaknessesDetails = {
  icon: React.ElementType
  name: string
  color: string
}

type PokemonWeaknessesProps = {
  types: string[]
}

export function WeaknessesPokemonType({ types }: PokemonWeaknessesProps) {
  const [doubleDamage, setDoubleDamage] = useState<PokemonWeaknessesDetails[]>([])

  // Função para obter as fraquezas e mapear com os ícones de pokemonsTypes
  async function GetWeakness(url: string) {
    const data = await fetch(url, {
      next: {
        revalidate: 60 * 60 * 24 * 30 * 7,
        tags: ['pokemon-weakness']
      }
    })
    const response = await data.json()

    // Mapeia `double_damage_from` para incluir o ícone correto
    const doubleDamageMapped = response.damage_relations.double_damage_from.map(
      (type: any) => {
        const pokemonType = pokemonsTypes.find(pt => pt.typeName === type.name)
        return {
          name: type.name,
          icon: pokemonType ? pokemonType.icon : null,
          color: pokemonType ? pokemonType.color : null
        }
      }
    )

    // Atualiza o estado de `doubleDamage` sem duplicatas
    setDoubleDamage(prevState => {
      const combined = [...prevState, ...doubleDamageMapped]
      return combined.filter(
        (item, index, self) => index === self.findIndex((t) => t.name === item.name)
      )
    })

    return response.damage_relations
  }

  useEffect(() => {
    types?.forEach(type => {
      GetWeakness(`https://pokeapi.co/api/v2/type/${type}`)
    })
  }, [types])

  return (
    <div className="flex items-center gap-1 text-2xl">
      <strong title="takes double damage" className="text-base">
        Weaknesses:
      </strong>
      <div className="flex items-center gap-1">
        {doubleDamage.map((item, index) => {
          const IconComponent = item.icon
          return (
            <div
              key={index}
              style={{ color: item.color }}
              title={item.name}
              className="flex items-center gap-1"
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
