interface EvolutionDetails {
  // Defina os campos relevantes para os detalhes da evolução, dependendo dos dados que deseja acessar
  // Por exemplo: item, trigger, min_level, ou outros campos específicos
  item: null | { name: string; url: string };
  trigger: null | { name: string; url: string };
  min_level: number | null;
  // Adicione outros campos conforme necessário
}

interface EvolutionChainTo {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  }
  evolves_to: EvolutionChainTo[];
}

export interface EvolutionChain {
  baby_trigger_item: { name: string; url: string };
  id: number;
  chain: {
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
    evolves_to: EvolutionChainTo[] ;
    evolution_details: EvolutionDetails[];
  };
}

