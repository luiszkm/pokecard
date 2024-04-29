import { useState, useEffect } from 'react'
import {
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri'

const totalPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

type PaginationProps = {
  onPageChange: (page: number) => void

}

export function Pagination({ onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPagesRendered, setTotalPagesRendered] = useState(totalPages.slice(0, 5))

  const handlePagination = (value: any) => {    
    setCurrentPage(value)
    onPageChange(value)
  }


  useEffect(() => {
    if (currentPage > 5) {
      const firstPage = currentPage - 5
      const paginateRender = totalPages.slice(firstPage, currentPage)
      setTotalPagesRendered(paginateRender)
    } else {
      setTotalPagesRendered(totalPages.slice(0, 5))
    }
  }, [currentPage])

  return (
    <div className="flex items-center gap-2">
      <div className='w-5 h-5 rounded-full border border-black 
       from-white via-white to-fire bg-gradient-to-t
      flex items-center justify-center '>
        <div className='h-0.5 w-full bg-black flex items-center justify-center'>
          <div className='h-2 w-2 rounded-full bg-black flex items-center justify-center'>
            <div className='h-1 w-1 rounded-full bg-white flex items-center justify-center font-bold text-fire'>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => handlePagination(1)}>
        <RiArrowLeftDoubleLine />
      </button>
      <button onClick={() =>handlePagination(
        currentPage === 1 ? 1 : currentPage - 1
      )}>
        <RiArrowLeftSLine />
      </button>
     
      {totalPagesRendered.map(page => (
        <button key={page} 
        onClick={() => handlePagination(page)}
        style={{ fontWeight: page === currentPage ? 'bold' : 'normal' ,
        color: page === currentPage ? 'red' : 'black',

        }
        
      }
        >
          {page}
        </button>
      ))}
       <button>{currentPage === 15 ? "" : "..."}</button>
      <button onClick={() => handlePagination(
        currentPage === 1 ? 1 : currentPage
      )}>
        <RiArrowRightSLine />
      </button>
      <button onClick={() => handlePagination(totalPages.length)}>
        <RiArrowRightDoubleLine />
      </button>
      <div className='w-5 h-5 rounded-full border border-black 
       from-white via-white to-fire bg-gradient-to-t
      flex items-center justify-center '>
        <div className='h-0.5 w-full bg-black flex items-center justify-center'>
          <div className='h-2 w-2 rounded-full bg-black flex items-center justify-center'>
            <div className='h-1 w-1 rounded-full bg-white flex items-center justify-center font-bold text-fire'>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
