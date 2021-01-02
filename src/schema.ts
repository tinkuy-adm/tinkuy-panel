export type PoliceStation = {
  id: number;
  nombre: string;
  direccion: string;
  distrito: string;
  latitud: number;
  longitud: number;
};

export enum PeopleStatus {
  OK = "ok",
  BRIGADA = "brigada",
  LEGAL = "legal",
  DETENCION = "detencion",
  SOS = "sos",
}

export enum DataSource {
  QAS = "QAS",
  PROD = "PROD",
}

export type PeoplePos = {
  latitud: string;
  longitud: string;
  status?: PeopleStatus;
  name?: string;
  tstamp?: number;
};

export type Cluster = {
  cluster_id: string;
  points: {
    type: string;
    values: string[];
  }[];
};
