import { SupportedLocale } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { dynamicActivate, Provider } from 'lib/i18n'
import { ReactNode, useCallback } from 'react'
import { useUserLocaleManager } from 'state/user/hooks'

import { DEFAULT_LOCALE } from './constants/locales'

dynamicActivate(DEFAULT_LOCALE)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale()
  const [, setUserLocale] = useUserLocaleManager()

  const onActivate = useCallback(
    (locale: SupportedLocale) => {
      document.documentElement.setAttribute('lang', locale)
      setUserLocale(DEFAULT_LOCALE) // stores the selected locale to persist across sessions
    },
    [setUserLocale]
  )

  return (
    <Provider locale={locale} forceRenderAfterLocaleChange={false} onActivate={onActivate}>
      {children}
    </Provider>
  )
}
