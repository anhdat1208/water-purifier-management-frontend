export function useApiClient() {
  const { $apiClient } = useNuxtApp()
  return $apiClient
}
