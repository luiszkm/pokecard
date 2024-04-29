/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig


module.exports = {
  env: {
    POKE_API: 'https://pokeapi.co/api/v2/pokemon',
    POKE_API_EVOLUTION: 'https://pokeapi.co/api/v2/pokemon-species',
  },
}