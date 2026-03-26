export interface Profile {
  id: string;
  nome: string | null;
  bio: string | null;
  foto_url: string | null;
  estado: string | null;
  cidade: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  linkedin: string | null;
  email_contato: string | null;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export interface Technique {
  id: string;
  nome: string;
  created_at: string;
}

export interface ProfileTechnique {
  id: string;
  profile_id: string;
  technique_id: string;
}

export interface ProfileWithTechniques extends Profile {
  techniques: Technique[];
}
