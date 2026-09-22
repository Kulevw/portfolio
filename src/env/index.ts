export interface Env {
  readonly REPO_NAME: string
  readonly IS_CLIENT: boolean
}

const mapRawEnv = (rawEnv: ImportMetaEnv): Env => {
  return {
    REPO_NAME: rawEnv.VITE_REPO_NAME,
    IS_CLIENT: !rawEnv.SSR,
  }
}

export const env = mapRawEnv(import.meta.env)
