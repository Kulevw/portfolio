export const wait = (ms = 1000, signal?: AbortSignal): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject()
    })

    const id = setTimeout(resolve, ms)
  })
}
