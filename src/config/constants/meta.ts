import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'DFH Finance',
  description:
    'DFH Finance là nền tảng số hóa và chia sẽ cơ hội đầu tư vào ngành bất động sản tại các thành phố lớn và ở khắp các tỉnh thành tại Việt Nam.',
  image: '/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('DFH Finance')}`,
      }
    case '/swap':
      return {
        title: `${t('Swap')} | ${t('DFH Finance')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('DFH Finance')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('DFH Finance')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('DFH Finance')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('DFH Finance')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('DFH Finance')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('DFH Finance')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('DFH Finance')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('DFH Finance')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('DFH Finance')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('DFH Finance')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('DFH Finance')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('DFH Finance')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('DFH Finance')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('DFH Finance')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('DFH Finance')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('DFH Finance')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('DFH Finance Info & Analytics')}`,
        description: 'View statistics for DFH Finance exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('DFH Finance Info & Analytics')}`,
        description: 'View statistics for DFH Finance exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('DFH Finance Info & Analytics')}`,
        description: 'View statistics for DFH Finance exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('DFH Finance')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('DFH Finance')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('DFH Finance')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('DFH Finance')}`,
      }
    default:
      return null
  }
}
