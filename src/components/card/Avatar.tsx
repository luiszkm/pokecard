import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {CgPokemon} from 'react-icons/cg'
type AvatarEvolutionProps = {
  evolution: string
}
export function AvatarEvolution({evolution}: AvatarEvolutionProps) {
  return (
    <Avatar>
      <AvatarImage src={evolution} alt="@shadcn" />
      <AvatarFallback><CgPokemon /></AvatarFallback>
    </Avatar>
  )
}
