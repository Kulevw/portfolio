import { onBeforeMount, ref, customRef, computed, provide, inject, type ComputedRef, watch } from "vue"

const STORAGE_THEME_KEY = 'theme'
const PROVIDE_SAVED_THEME_KEY = 'SAVED_THEME'
const PROVIDE_THEME_DARK_KEY = 'THEME_DARK'
const DOCUMENT_THEME_ATTRIBUTE_KEY = 'data-theme';

export enum SavedTheme {
  Light = 'light',
  Dark = 'dark',
}

export const useAppTheme = () => {
  const isPrefersColorSchemeDark = ref<boolean>(false);
  const savedTheme = customRef((track, trigger) => {
    let currentValue = getSavedTheme();

    return {
      get(): SavedTheme | null {
        track();
        return currentValue;
      },
      set(value: SavedTheme | null) {
        setSavedTheme(value)
        currentValue = value
        trigger();
      }
    }
  });

  const isThemeDark = computed(
    () => savedTheme.value
      ? savedTheme.value === SavedTheme.Dark
      : isPrefersColorSchemeDark.value
  )

  provide(PROVIDE_THEME_DARK_KEY, isThemeDark)
  provide(PROVIDE_SAVED_THEME_KEY, savedTheme)

  function watchPrefersColorScheme() {
    const isSupportedPrefersColorScheme = window?.matchMedia(`(prefers-color-scheme)`)?.media === '(prefers-color-scheme)'

    if (!isSupportedPrefersColorScheme) {
      return
    }

    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

    isPrefersColorSchemeDark.value = mediaQueryList.matches;

    mediaQueryList.addEventListener('change', onUpdatePrefersColorScheme)

    return () => {
      mediaQueryList.removeEventListener('change', onUpdatePrefersColorScheme)
    }
  }

  function getSavedTheme() {
    const initialValue = localStorage.getItem(STORAGE_THEME_KEY) as SavedTheme;

    if (!Object.values(SavedTheme).includes(initialValue as SavedTheme)) {
      localStorage.removeItem(STORAGE_THEME_KEY)
      return null
    }

    return initialValue
  }

  function setSavedTheme(value: SavedTheme | null) {
    if (value) {
      localStorage.setItem(STORAGE_THEME_KEY, value)
    } else {
      localStorage.removeItem(STORAGE_THEME_KEY)
    }
  }

  function onUpdatePrefersColorScheme(event: MediaQueryListEvent) {
    isPrefersColorSchemeDark.value = event.matches
  }

  function onUpdateDocumentAttributeTheme(theme: SavedTheme | null) {
    document.documentElement.setAttribute(DOCUMENT_THEME_ATTRIBUTE_KEY, theme ?? '')
  }

  onBeforeMount(() => {
    const stopers = [
      watchPrefersColorScheme(),
      watch(savedTheme, onUpdateDocumentAttributeTheme, { immediate: true })
    ]

    return () => stopers.forEach(stop => stop?.())
  });

  return {
    savedTheme,
    isThemeDark,
  }
}

export const useSavedTheme = (): ComputedRef<SavedTheme | null> => inject(PROVIDE_SAVED_THEME_KEY) ?? computed(() => null)

