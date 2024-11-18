export const isLocalDev = () => import.meta.env.DEV
export const getEnvMode = () => import.meta.env.MODE

export const isProduction = () => getEnvMode() === 'production'
