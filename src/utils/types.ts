
import {
  BsFire,
  BsFillBugFill,
  BsRecordCircleFill
}
  from 'react-icons/bs'
import {
  GiSeaDragon,
  GiPoisonBottle,
  GiAngelWings,
  GiWaterDrop,
  GiHighGrass,
  GiElectric,
  GiIceIris,
  GiIceBolt,
  GiFairyWand,
  GiMoon,
  GiGhost,
  GiMetalBar,
  GiMountainRoad,
  GiStonePile,
  GiBoxingGloveSurprise
}
  from 'react-icons/gi'

type PokemonTypeProps = {
  typeName: string;
  color: string;
  icon: any;
}

export const pokemonsTypes: PokemonTypeProps[] = [
  {
    typeName: 'normal',
    color: '#78716c',
    icon: BsRecordCircleFill
  },
  {
    typeName: 'fire',
    color: '#FF0000',
    icon: BsFire
  },
  {
    typeName: 'water',
    color: '#1d4ed8',
    icon: GiWaterDrop
  },
  {
    typeName: 'grass',
    color: '#78C850',
    icon: GiHighGrass
  },
  {
    typeName: 'electric',
    color: '#F8D030',
    icon: GiElectric
  },
  {
    typeName: 'ice',
    color: '#7dd3fc',
    icon:  GiIceBolt
  },
  {
    typeName: 'fighting',
    color: '#C03028',
    icon: GiBoxingGloveSurprise
  },
  {
    typeName: 'poison',
    color: '#581c87',
    icon: GiPoisonBottle
  },
  {
    typeName: 'ground',
    color: '#292524',
    icon: GiMountainRoad
  },
  {
    typeName: 'flying',
    color: '#fed7aa',
    icon: GiAngelWings
  },
  {
    typeName: 'psychic',
    color: '#F85888',
    icon: GiIceIris
  },
  {
    typeName: 'bug',
    color: '#A8B820',
    icon: BsFillBugFill
  },
  {
    typeName: 'rock',
    color: '#451a03',
    icon: GiStonePile
  },
  {
    typeName: 'ghost',
    color: '#705898',
    icon: GiGhost
  }, 
  {
    typeName: 'dragon',
    color: '#7038F8',
    icon: GiSeaDragon
  }, 
  {
    typeName: 'dark',
    color: '#020617',
    icon: GiMoon
  }, 
  {
    typeName: 'steel',
    color: '#B8B8D0',
    icon: GiMetalBar
  }, 
  {
    typeName: 'fairy',
    color: '#db2777',
    icon: GiFairyWand
  }, 
  {
    typeName: 'unknown',
    color: '#cbd5e1',
    icon: BsRecordCircleFill
  }, 
  {
    typeName: 'shadow',
    color: '#1f2937',
    icon: BsRecordCircleFill
  },

]