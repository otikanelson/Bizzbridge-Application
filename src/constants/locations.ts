export interface Location {
  id: string;
  name: string;
  region: 'mainland' | 'island';
  localities?: string[];
}

export const LAGOS_LGAS: Location[] = [
  {
    id: 'alimosho',
    name: 'Alimosho',
    region: 'mainland',
    localities: ['Ikotun', 'Egbeda', 'Idimu', 'Iyana-Ipaja'],
  },
  {
    id: 'ajeromi-ifelodun',
    name: 'Ajeromi-Ifelodun',
    region: 'mainland',
    localities: ['Ajegunle', 'Boundary', 'Olodi'],
  },
  {
    id: 'kosofe',
    name: 'Kosofe',
    region: 'mainland',
    localities: ['Ketu', 'Ikosi', 'Oworonshoki', 'Anthony'],
  },
  {
    id: 'mushin',
    name: 'Mushin',
    region: 'mainland',
    localities: ['Idi-Oro', 'Papa Ajao', 'Odi-Olowo'],
  },
  {
    id: 'oshodi-isolo',
    name: 'Oshodi-Isolo',
    region: 'mainland',
    localities: ['Oshodi', 'Isolo', 'Okota', 'Mafoluku'],
  },
  {
    id: 'ojo',
    name: 'Ojo',
    region: 'mainland',
    localities: ['Ojo Town', 'Ajangbadi', 'Okokomaiko'],
  },
  {
    id: 'ikorodu',
    name: 'Ikorodu',
    region: 'mainland',
    localities: ['Ikorodu Town', 'Igbogbo', 'Imota'],
  },
  {
    id: 'surulere',
    name: 'Surulere',
    region: 'mainland',
    localities: ['Surulere', 'Adeniran Ogunsanya', 'Ojuelegba'],
  },
  {
    id: 'agege',
    name: 'Agege',
    region: 'mainland',
    localities: ['Agege', 'Dopemu', 'Orile-Agege'],
  },
  {
    id: 'ifako-ijaiye',
    name: 'Ifako-Ijaiye',
    region: 'mainland',
    localities: ['Ifako', 'Ijaiye', 'Fagba', 'Iju'],
  },
  {
    id: 'somolu',
    name: 'Somolu',
    region: 'mainland',
    localities: ['Somolu', 'Bariga', 'Gbagada Phase 1'],
  },
  {
    id: 'amuwo-odofin',
    name: 'Amuwo-Odofin',
    region: 'mainland',
    localities: ['Festac', 'Amuwo-Odofin', 'Mile 2'],
  },
  {
    id: 'lagos-mainland',
    name: 'Lagos Mainland',
    region: 'mainland',
    localities: ['Yaba', 'Ebute Metta', 'Oyingbo'],
  },
  {
    id: 'ikeja',
    name: 'Ikeja',
    region: 'mainland',
    localities: ['Ikeja GRA', 'Allen Avenue', 'Alausa', 'Ogba'],
  },
  {
    id: 'eti-osa',
    name: 'Eti-Osa',
    region: 'island',
    localities: ['Lekki', 'Ajah', 'Victoria Island', 'Ikoyi'],
  },
  {
    id: 'lagos-island',
    name: 'Lagos Island',
    region: 'island',
    localities: ['Lagos Island', 'Marina', 'Broad Street'],
  },
  {
    id: 'apapa',
    name: 'Apapa',
    region: 'mainland',
    localities: ['Apapa', 'Ajegunle', 'Kirikiri'],
  },
  {
    id: 'badagry',
    name: 'Badagry',
    region: 'mainland',
    localities: ['Badagry Town', 'Ajara', 'Ikoga'],
  },
  {
    id: 'epe',
    name: 'Epe',
    region: 'mainland',
    localities: ['Epe Town', 'Ejinrin', 'Poka'],
  },
  {
    id: 'ibeju-lekki',
    name: 'Ibeju-Lekki',
    region: 'island',
    localities: ['Ibeju', 'Lekki Free Zone', 'Eleko'],
  },
];

export const getLocationById = (id: string): Location | undefined => {
  return LAGOS_LGAS.find(loc => loc.id === id);
};

export const getLocalitiesByLGA = (lgaId: string): string[] => {
  return getLocationById(lgaId)?.localities || [];
};
