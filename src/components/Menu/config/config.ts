import { MenuItemsType } from '@dfh-finance/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Swap'),
    icon: 'Swap',
    href: '/swap',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Liquidity'),
    icon: 'Liquidity',
    href: '/liquidity',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Farms'),
    icon: 'Farms',
    href: '/farms',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Pools'),
    icon: 'Pools',
    href: '/pools',
    showItemsOnMobile: false,
    items: [],
  },
]

export default config
