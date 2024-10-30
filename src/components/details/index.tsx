import { Ability } from './Ability'
import { AvatarEvolution } from './Avatar'
import { pokemonsTypes } from '@/utils/types'
import { TbArrowBigUpLine, TbLineHeight } from 'react-icons/tb'
import { GiWeight } from 'react-icons/gi'
import { StatusBar } from './StatusBar'
import { WeaknessesPokemonType } from './WeaknessesPokemonType'
import { GetTypeIcons } from '../GetTypeIcons'

type StatsProps = {
  base_stat: number
  stat: {
    name: string
  }
}
type PokemonAbilities = {
  ability: {
    name: string
    url: string
  }
}
type PokemonTypes = {
  type: {
    name: string
    url: string
  }
}
type evolutionProps = {
  name: string
  imgs: string[]
}
type weaknessProps = {
  double_damage_from: string[]
  double_damage_to: string[]
  half_damage_from: string[]
  half_damage_to: string[]
  no_damage_from: string[]
  no_damage_to: string[]
}

type CardProps = {
  isLoading: boolean
  id: number
  name: string
  image: string
  secondImage: string
  evolutions: evolutionProps[]
  experience: number
  weight: number
  height: number
  stats: StatsProps[]
  pokemonAbilities: PokemonAbilities[]
  pokemonType: string[]
}

export function Details({
  id,
  image,
  secondImage,
  name,
  evolutions,
  stats,
  weight,
  height,
  experience,
  pokemonAbilities,
  pokemonType,

  isLoading
}: Readonly<CardProps>) {
  const typesFiltered = pokemonType?.map(i => {
    return pokemonsTypes?.filter(item => item.typeName === i)
  })
  const bgColor = `${
    typesFiltered && typesFiltered[0]?.map(item => item.color)[0]
  }`
  let bgcolor_secondary = `${
    typesFiltered && typesFiltered[1]?.map(item => item.color)[0]
  }`
  bgcolor_secondary =
    bgcolor_secondary === undefined ||
    bgcolor_secondary === null ||
    bgcolor_secondary === '' ||
    bgcolor_secondary === 'undefined'
      ? 'black'
      : bgcolor_secondary

  const pokemonImage = image === null || image === '' ? secondImage : image

  if (evolutions === undefined) evolutions = []
  const pokemonChainEvolution = evolutions.filter(i => i.name !== name)

  return (
    <div
      className="w-full max-w-4xl h-cardDetails rounded-3xl relative  
      p-4 flex items-center justify-center "
      style={{
        background: `linear-gradient( ${bgColor}, ${bgcolor_secondary})`
      }}
    >
      <div className="w-full flex bg-white h-full rounded-3xl ">
        <div className="w-full">
          <div className=" w-full flex items-center justify-between pr-1">
            <AvatarEvolution evolution={''} />
            <h2>{name}</h2>
            <div className="flex items-center">
              <GetTypeIcons types={pokemonType} />
            </div>
          </div>
          <img
            className={
              ' w-full max-w-xs h-1/2 rounded-3xl object-center shadow '
            }
            style={{
              backgroundImage: `repeating-conic-gradient(${bgColor} 17%, #f3f3ee 22%)`
            }}
            src={pokemonImage}
            alt=""
          />
          <div className=" flex flex-col px-2">
            <div className="flex items-center justify-center gap-4 text-xs font-bold">
              <span className="flex items-center">
                {' '}
                <TbArrowBigUpLine />
                XP {experience}
              </span>
              <span className="flex items-center">
                <GiWeight /> {weight}kg
              </span>
              <span className="flex items-center">
                <TbLineHeight /> {height}M
              </span>
            </div>
            <ul className="flex flex-wrap px-2 items-center gap-3">
              {stats &&
                stats.map((item: StatsProps) => (
                  <StatusBar
                    key={item.stat.name}
                    baseName={item.stat.name}
                    baseStatus={item.base_stat}
                  />
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between py-4">
          <Ability abilities={pokemonAbilities} />
          <WeaknessesPokemonType types={pokemonType} />
        </div>
        <div>
          {pokemonChainEvolution &&
            pokemonChainEvolution.map((item, index) => {
              return (
                <a
                  href={`/pokemon/${item.name}`}
                  className="flex-col gap-3"
                  key={index}
                >
                  <span className="m-2">{item.name}</span>
                  <img src={item.imgs[1]} alt="" />
                </a>
              )
            })}
        </div>
      </div>

      <span className="absolute bottom-0 text-xs right-10">#{id}</span>
    </div>
  )
}
