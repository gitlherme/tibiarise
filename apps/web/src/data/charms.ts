export interface Charm {
  name: string;
  type: "Damage" | "Utility" | "Critical";
  element?: "Ice" | "Energy" | "Earth" | "Fire" | "Death" | "Holy" | "Physical";
  description: string;
  image: string;
}

export const CHARMS: Charm[] = [
  {
    name: "Carnage",
    type: "Damage",
    element: "Physical",
    description:
      "Matando uma criatura tem chance de causar Physical Damage em área.",
    image: "/assets/charms/Carnage_Icon.gif",
  },
  {
    name: "Curse",
    type: "Damage",
    element: "Death",
    description: "Seu ataque amaldiçoa a criatura causando Death Damage.",
    image: "/assets/charms/Curse_Icon.gif",
  },
  {
    name: "Divine Wrath",
    type: "Damage",
    element: "Holy",
    description: "Seu ataque tem chance de causar Holy Damage.",
    image: "/assets/charms/Divine_Wrath_Icon.gif",
  },
  {
    name: "Dodge",
    type: "Utility",
    description: "Esquiva de um ataque sem sofrer dano.",
    image: "/assets/charms/Dodge_Icon.gif",
  },
  {
    name: "Enflame",
    type: "Damage",
    element: "Fire",
    description: "Seu ataque queima a criatura causando Fire Damage.",
    image: "/assets/charms/Enflame_Icon.gif",
  },
  {
    name: "Freeze",
    type: "Damage",
    element: "Ice",
    description: "Seu ataque congela a criatura causando Ice Damage.",
    image: "/assets/charms/Freeze_Icon.gif",
  },
  {
    name: "Low Blow",
    type: "Critical",
    description: "Adiciona chance de ataque crítico.",
    image: "/assets/charms/Low_Blow_Icon.gif",
  },
  {
    name: "Overpower",
    type: "Damage",
    description: "Chance de causar dano baseado na vida total do personagem.",
    image: "/assets/charms/Overpower_Icon.gif",
  },
  {
    name: "Overflux",
    type: "Damage",
    description: "Chance de causar dano baseado na mana total do personagem.",
    image: "/assets/charms/Overflux_Icon.gif",
  },
  {
    name: "Parry",
    type: "Utility",
    description: "Reflete dano recebido para o agressor.",
    image: "/assets/charms/Parry_Icon.gif",
  },
  {
    name: "Poison",
    type: "Damage",
    element: "Earth",
    description: "Seu ataque envenena a criatura causando Earth Damage.",
    image: "/assets/charms/Poison_Icon.gif",
  },
  {
    name: "Savage Blow",
    type: "Critical",
    description: "Adiciona dano crítico extra.",
    image: "/assets/charms/Savage_Blow_Icon.gif",
  },
  {
    name: "Wound",
    type: "Damage",
    element: "Physical",
    description: "Seu ataque fere a criatura causando Physical Damage.",
    image: "/assets/charms/Wound_Icon.gif",
  },
  {
    name: "Zap",
    type: "Damage",
    element: "Energy",
    description: "Seu ataque eletrocuta a criatura causando Energy Damage.",
    image: "/assets/charms/Zap_Icon.gif",
  },
];
