import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`, {
    next: {
      revalidate: 1 // prod aumentar o cache
    }
  })
  return NextResponse.json(await response.json());
}