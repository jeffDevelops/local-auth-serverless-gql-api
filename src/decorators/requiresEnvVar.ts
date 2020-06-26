export function RequiresEnvVars(envVars: string[]) {
  const allEnvVarsExist = () => {
    return envVars.every((variable) =>
      process.env[variable]
        ? true
        : (() => {
            console.error(`Environment variable ${variable} required`)
            return false
          })()
    )
  }

  if (allEnvVarsExist()) {
    return function (constructor) {
      envVars.forEach(
        (envVar) =>
          (constructor.prototype[envVar] = process.env[envVar] as string)
      )
    }
  } else {
    throw new Error(
      'Not all required environment variables were present in .env. See above errors for more details.'
    )
  }
}
