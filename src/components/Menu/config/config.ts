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
    icon: 'Earn',
    href: '/liquidity',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Farms'),
    icon: 'Trophy',
    href: '/farms',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Pools'),
    icon: 'Nft',
    href: '/pools',
    showItemsOnMobile: false,
    items: [],
  },
]

export default config
