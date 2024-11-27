import { Ability } from './Ability'
import { AvatarEvolution } from './Avatar'
import { StatusBar } from './StatusBar'
import { pokemonsTypes } from '@/utils/types'
import { TbArrowBigUpLine, TbLineHeight } from 'react-icons/tb'
import { GiWeight } from 'react-icons/gi'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import { WeaknessesPokemonType } from '../WeaknessesPokemonType'
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


type CardProps = {
  isLoading: boolean
  id: number
  name: string
  image: string
  secondImage: string
  prevEvolution: string
  experience: number
  weight: number
  height: number
  stats: StatsProps[]
  pokemonAbilities: PokemonAbilities[]
  pokemonType: string[]
}

export function Card({
  id,
  image,
  secondImage,
  name,
  prevEvolution,
  stats,
  weight,
  height,
  experience,
  pokemonAbilities,
  pokemonType,
  isLoading
}: Readonly<CardProps>) {
  const types = pokemonType?.map(item => item)
  const typesFiltered = types?.map(i => {
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

  return isLoading ? (
    <div className=' min-w-xs p-4 h-card rounded-3xl bg-gradient-to-tr from-black via-zinc-700 to-zinc-900 animate-pulse'>
      <div className='h-full w-full rounded-3xl  p-4 flex items-center justify-center
      bg-gradient-to-tl from-neutral-700 via-slate-100 to-gray-700'>
      
      <Image
        src="/images/5.png"
        width={200}
        height={200}
        alt="imagem de uma pokebola"
      />
      </div>
 
    </div>
  ) : (
    <a className=' rounded-full hover:shadow-lg  hover:scale-105
         '
     href={`/pokemon/${id}`}>   
     <div
      className={twMerge(
        `w-full max-w-xs h-card rounded-3xl relative 
         p-4 flex items-center justify-center animate-rotate-y animate-once animate-ease-in-out`
      )}
      style={{
        background: `linear-gradient( ${bgColor}, ${bgcolor_secondary})`
      }}
    >
      <div className="w-full bg-white h-full rounded-3xl hove:scale-105 ">
        <div className=" w-full flex items-center justify-between pr-1">
          <AvatarEvolution evolution={prevEvolution} />
          <h2>{name}</h2>
          <div className="flex items-center">
          <GetTypeIcons types={pokemonType} />

          </div>
        </div>
        <img
          className={' w-full h-1/2 rounded-3xl object-center '}
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
        <div className='flex flex-col py-0 px-2 gap-5'>
        <Ability abilities={pokemonAbilities} />
        <WeaknessesPokemonType types={pokemonType} />
        </div>
        </div>
      </div>
      
      <span className="absolute bottom-0 text-xs right-10">#{id}</span>
    </div>
    </a>
  )
}
