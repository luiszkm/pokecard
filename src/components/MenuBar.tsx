import { pokemonsTypes } from "@/utils/types";

type PokemonTypes = {
  type: {
    name: string
    url: string
  }
}


export function MenuBar (){

  return(
    <aside className="h-full w-72">
      <nav>
        <ul>
          {
            pokemonsTypes.map((item, index) => (
              <li className="border-b-2 w-full border-dark hover:bg-gray-200 hover:text-white transition duration-300 ease-in-out"
               key={index}
               style={{ color: item.color }}
               >
                <a href="#" className="flex items-center space-x-2 p-4">
                  <item.icon size={24}  />
                  <span className="">{item.typeName}</span>
                </a>
              </li>
            ))
          }
        </ul>
      </nav> 
    </aside>
  )
}