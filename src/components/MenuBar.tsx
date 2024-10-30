'use client'
import { pokemonsTypes } from '@/utils/types'
import { RxDoubleArrowDown, RxDoubleArrowUp } from 'react-icons/rx'
import { useState } from 'react'
import { PokeBallIcon } from './PokeBallIcon'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function MenuBar() {
  const [isHidden, setIsHidden] = useState(true)
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter()
  function handleOpenMenu(isHidden: boolean) {
    if (isHidden) {
      setIsHidden(false)
    } else {
      setIsHidden(true)
    }
  }
  function handleSearchPokemons (e:any){
    e.preventDefault()
    
    router.push(`/pokemon/${searchValue}`)
   
    
  }

  return (
    <aside className="h-full w-72">
      <nav>
        <form 
        onSubmit={(e)=> handleSearchPokemons(e)}
         className="flex w-full p-2">
          <label className="flex-column w-full
           text-center text-xs" htmlFor="search">
       
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
                onChange={(e)=> setSearchValue(e.target.value)}
              />
              <button type='submit'>
              <SearchIcon />
              </button>
            </div>
          </label>
        </form>
        <ul>
          <li
            className="border-b-2 w-full
         border-dark
          hover:bg-gray-200 hover:text-white transition duration-300 ease-in-out"
          >
            <button
              onClick={() => handleOpenMenu(isHidden)}
              className="flex items-center justify-between gap-4 w-full h-full p-4"
            >
              <PokeBallIcon />
              Abrir Menu
              {isHidden ? (
                <RxDoubleArrowDown onClick={() => setIsHidden(false)} />
              ) : (
                <RxDoubleArrowUp onClick={() => setIsHidden(true)} />
              )}
            </button>
          </li>
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
