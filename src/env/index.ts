export interface IEnv {
  readonly REPO_NAME: string;
}

const mapEnv = (rawEnv: ImportMetaEnv): IEnv => {
  return {
    REPO_NAME: rawEnv.BASE_URL,
  }
}

export const env = mapEnv(import.meta.env);
