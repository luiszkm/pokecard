interface EffectEntry {
  language: any;
  effect: string;
  short_effect:string
  // Defina os campos relevantes aqui com seus tipos correspondentes
  // Por exemplo: effect: string; hidden: boolean; ...
}

interface FlavorTextEntry {
  // Defina os campos relevantes aqui com seus tipos correspondentes
  // Por exemplo: flavorText: string; language: string; ...
}

interface Generation {
  name: string;
  url: string;
}

interface NameEntry {
  // Defina os campos relevantes aqui com seus tipos correspondentes
  // Por exemplo: name: string; language: string; ...
}

interface PokemonEntry {
  // Defina os campos relevantes aqui com seus tipos correspondentes
  // Por exemplo: pokemonName: string; url: string; ...
}

export interface Ability {
  effect_changes: any[]; // Substitua 'any' com o tipo correto, se aplicável
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: Generation;
  id: number;
  is_main_series: boolean;
  name: string;
  names: NameEntry[];
  pokemon: PokemonEntry[];
}


