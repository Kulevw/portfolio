import { ref } from 'vue'

export const useRunningState = () => {
  const isRunning = ref(false)

  function start(): void {
    isRunning.value = true
  }

  function finish(): void {
    isRunning.value = false
  }

  function withRunning<T = unknown>(promise: Promise<T>): Promise<T> {
    start()

    return promise.finally(finish)
  }

  return [isRunning, withRunning] as [typeof isRunning, typeof withRunning]
}
