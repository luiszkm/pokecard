'use client'
import {GiShiningSword,
  GiBroadsword,
  GiWalkingBoot,
  GiHeartPlus,
   GiVibratingShield
  } from 'react-icons/gi'
import {FiShield} from 'react-icons/fi'
type StatusBarProps = {
  baseStatus: number
  baseName: string
}
type StatusProps = {
  name: string
  icon: any
}

export function StatusBar({ baseStatus, baseName }: StatusBarProps) {
  const status: StatusProps[] = [
    {
      name: 'hp',
      icon: GiHeartPlus
    },
    {
      name: 'attack',
      icon: GiBroadsword
    },
    {
      name: 'defense',
      icon: FiShield
    },
    {
      name: 'speed',
      icon: GiWalkingBoot
    },
    {
      name: 'special-attack',
      icon: GiShiningSword
    },
    {
      name: 'special-defense',
      icon: GiVibratingShield
    }
  ]
  const stat = status.find(item => item.name === baseName)
  return (
      <li className="flex items-center" title={baseName}>
        {stat && <stat.icon key={stat.name} className="w-8" />}
        <span>{baseStatus}</span>
      </li>
  )
}
