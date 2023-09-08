interface Ability {
  // Defina os campos relevantes para a habilidade, dependendo dos dados que deseja acessar
  // Exemplo: name, url, ou outros campos específicos
  ability:{
    name: string;
    url: string;
  }
  }


interface Form {
  // Defina os campos relevantes para o formulário, dependendo dos dados que deseja acessar
  // Exemplo: name, url, ou outros campos específicos
  name: string;
  url: string;
}

interface GameIndex {
  // Defina os campos relevantes para o índice de jogo, dependendo dos dados que deseja acessar
  // Exemplo: game_index, version, ou outros campos específicos
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

interface HeldItem {
  // Defina os campos relevantes para o item segurado, dependendo dos dados que deseja acessar
  // Exemplo: item, version_details, ou outros campos específicos
  item: {
    name: string;
    url: string;
  };
  version_details: any; // Defina os campos específicos deste objeto
}

interface Move {
  // Defina os campos relevantes para o movimento, dependendo dos dados que deseja acessar
  // Exemplo: move, version_group_details, ou outros campos específicos
  move: {
    name: string;
    url: string;
  };
  version_group_details: any; // Defina os campos específicos deste objeto
}

interface Species {
  // Defina os campos relevantes para a espécie, dependendo dos dados que deseja acessar
  // Exemplo: name, url, ou outros campos específicos
  name: string;
  url: string;
}

interface Sprites {
  // Defina os campos relevantes para os sprites, dependendo dos dados que deseja acessar
  // Exemplo: back_default, front_default, ou outros campos específicos
  back_default: string ;
  back_female: string ;
  back_shiny: string ;
  back_shiny_female: string ;
  front_default: string ;
  front_female: string ;
  front_shiny: string ;
  front_shiny_female: string ;
  other: {
    dream_world: {
      front_default: string ;
      front_female: string ;
    };
    home: {
      front_default: string ;
      front_female: string ;
    };
    'official-artwork': {
      front_default: string ;
    };
  };
}

interface Version {
  // Defina os campos relevantes para a versão, dependendo dos dados que deseja acessar
  // Exemplo: name, url, ou outros campos específicos
  name: string;
  url: string;
}

interface Stats {
  // Defina os campos relevantes para as estatísticas, dependendo dos dados que deseja acessar
  // Exemplo: base_stat, effort, stat, ou outros campos específicos
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Type {
  // Defina os campos relevantes para o tipo, dependendo dos dados que deseja acessar
  // Exemplo: slot, type, ou outros campos específicos
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonData {
  abilities: Ability[];
  base_experience: number;
  forms: Form[];
  game_indices: GameIndex[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  past_types: any[]; // Defina os campos específicos deste objeto, se houver
  species: Species;
  sprites: Sprites;
  versions: Record<string, Version>; // Use Record para definir campos de versões dinâmicas
  stats: Stats[];
  types: Type[];
  weight: number;
}


