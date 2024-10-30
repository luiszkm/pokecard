'use client'
import { pokemonsTypes } from '@/utils/types'
import { RxDoubleArrowDown, RxDoubleArrowUp } from 'react-icons/rx'
import { useState } from 'react'
import { PokeBallIcon } from './PokeBallIcon'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MenuBar() {
  const [isHidden, setIsHidden] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  function handleOpenMenu(isHidden: boolean) {
    if (isHidden) {
      setIsHidden(false)
    } else {
      setIsHidden(true)
    }
  }
  function handleSearchPokemons(e: any) {
    e.preventDefault()

    router.push(`/pokemon/${searchValue}`)
  }

  return (
    <aside className="h-fit w-72">
      <nav>
        <form
          onSubmit={e => handleSearchPokemons(e)}
          className="flex w-full p-2"
        >
          <label
            className="flex-column w-full
           text-center text-xs"
            htmlFor="search"
          >
            Pesquise seu pokemon
            <div
              className="flex items-center gap-2 px-2 w-full
               border border-dark rounded-xl group focus-within:border-fire transition duration-300 ease-in-out"
            >
              <input
                id="search"
                type="text"
                placeholder="Ex: charmander"
                className="w-full h-full p-4 outline-none bg-transparent"
                onChange={e => setSearchValue(e.target.value)}
              />
              <button type="submit">
                <SearchIcon />
              </button>
            </div>
          </label>
        </form>
        <button
          onClick={() => handleOpenMenu(isHidden)}
          className="flex items-center justify-between gap-4 w-full h-full p-4"
        >
          <PokeBallIcon />
          Atributos
          {isHidden ? (
            <RxDoubleArrowDown onClick={() => setIsHidden(false)} />
          ) : (
            <RxDoubleArrowUp onClick={() => setIsHidden(true)} />
          )}
        </button>
        <ul
          className='max-h-[400px] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
             [&::-webkit-scrollbar-track]:bg-gray-100
             [&::-webkit-scrollbar-thumb]:bg-gray-300
               dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" '
        >
          {!isHidden &&
            pokemonsTypes.map((item, index) => (
              <li
                className="border-b-2 w-full border-dark hover:bg-gray-200 hover:text-white transition duration-300 ease-in-out"
                key={index}
                style={{ color: item.color }}
              >
                <a
                  href={`/${item.typeName}`}
                  className="flex items-center space-x-2 p-4"
                >
                  <item.icon size={24} />
                  <span className="">{item.typeName}</span>
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  )
}
