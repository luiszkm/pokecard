import { Ability } from './Ability'
import { AvatarEvolution } from './Avatar'
import { pokemonsTypes } from '@/utils/types'
import { TbArrowBigUpLine, TbLineHeight } from 'react-icons/tb'
import { GiWeight } from 'react-icons/gi'
import { StatusBar } from './StatusBar'
import { WeaknessesPokemonType } from '../WeaknessesPokemonType'
import { GetTypeIcons } from '../GetTypeIcons'
import Image from 'next/image'

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
type evolutionProps = {
  name: string
  imgs: string[]
}

type CardProps = {
  isLoading: boolean
  id: string
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
  onEvolutionClick: (name: string) => void // Função para manipular o clique
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
  onEvolutionClick, // Nova prop para cliques nas evoluções
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

  return isLoading ? (
    <div className=" w-full max-w-4xl h-cardDetails rounded-3xl relative  
      p-4 flex items-center justify-center bg-black ">
      <div style={{ background: `repeating-conic-gradient(black 17%, #f3f3ee 22%)` }}
       className="h-full w-full rounded-3xl  p-4 flex items-center animate-pulse
       justify-center bg-gradient-to-tl from-neutral-700 via-slate-100 to-gray-700">
        <Image
          src="/images/5.png"
          width={200}
          height={200}
          alt="imagem de uma pokebola"
        />
      </div>
    </div>
  ) : (
    <div
      className="w-full max-w-4xl md:h-cardDetails rounded-3xl relative  
      p-4 flex items-center justify-center "
      style={{
        background: `linear-gradient( ${bgColor}, ${bgcolor_secondary})`
      }}
    >
      <div className="w-full flex flex-col md:flex-row bg-white h-full rounded-3xl ">
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
              ' w-full max-w-xs h-1/2 rounded-3xl object-center shadow animate-fade-down'
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
                    key={`${item.stat.name}-${item.base_stat}`}
                    baseName={item.stat.name}
                    baseStatus={item.base_stat}
                  />
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-col items-center justify-between py-4">
          <Ability abilities={pokemonAbilities} />
          <WeaknessesPokemonType types={pokemonType} />
        </div>
        <div className='flex items-center md:flex-col justify-center gap-5'>
          {pokemonChainEvolution &&
            pokemonChainEvolution.map((item, index) => {
              return (
                <button
                  onClick={() => onEvolutionClick(item.name)} // Atualizar o estado ao clicar
                  className="flex-col gap-3"
                  key={index}
                >
                  <span className="m-2">{item.name}</span>
                  <img
                    className="animate-fade-right max-w-[100px]  h-[100px] md:max-w-[200px]  md:h-[200px] rounded-3xl"
                    src={item.imgs[1]}
                    alt={item.name}
                  />
                </button>
              )
            })}
        </div>
      </div>
      <span className="absolute bottom-0 text-xs right-10">#{id}</span>
    </div>
  )
}
