'use client'
import { pokemonsTypes } from "@/utils/types";
import { useEffect, useState } from "react";

type PokemonTypeProps = {
 types: string[],
}

type PokemonTypesDetails = {
  icon: React.ElementType
  name: string
  color: string 
}

export function GetTypeIcons ({types}: PokemonTypeProps) {
const [pokemonTypes, setPokemonTypes] = useState<PokemonTypesDetails[]>([])

function getPokemonTypes (){
  
  const typesMapped = types?.map(type => {
    const pokemonType = pokemonsTypes.find(pt => pt.typeName === type)
    return {
      name: type,
      icon: pokemonType ? pokemonType.icon : '',
      color: pokemonType ? pokemonType.color : ''
    }
  })
  setPokemonTypes(typesMapped)

}

useEffect(() =>
  getPokemonTypes(),

[])
  return(
    <div className="flex items-center gap-1">
        {pokemonTypes &&
          pokemonTypes.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                style={{ color: item.color }}
                title={item.name}
                className="flex items-center gap-1"
              >
                <IconComponent className="w-6 h-6" />
              </div>
            )
          })}
      </div>
  )
}