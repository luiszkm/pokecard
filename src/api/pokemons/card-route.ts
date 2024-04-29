import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
  const url = new URL(req.url);  
  const text = url.searchParams.get("text")
   const response = await fetch(`${process.env.POKE_API}`,{
      next: {
        revalidate: 100,
        tags: ['pokemons']
      }
    
   })

   return NextResponse.json(await response.json())
}

