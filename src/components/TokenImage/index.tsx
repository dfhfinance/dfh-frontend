import React from 'react'
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from 'components/TokenImage/Image'
import tokens, { mainnetTokens, testnetTokens } from 'config/constants/tokens'
import { Token } from '@dfh-finance/sdk'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  const address = token.symbol === 'BNB' ? tokens.wbnb.address : token.address
  return `/images/tokens/${address}.svg`
}

const isDfh = (token: Token) => {
  return token.equals(testnetTokens.dfh) || token.equals(mainnetTokens.dfh)
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
  const primarySrc = isDfh(primaryToken) ? '/logo.png' : getImageUrlFromToken(primaryToken)
  const secondarySrc = isDfh(secondaryToken) ? '/logo.png' : getImageUrlFromToken(secondaryToken)
  return <UIKitTokenPairImage primarySrc={primarySrc} secondarySrc={secondarySrc} {...props} />
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  const src = isDfh(token) ? '/logo.png' : getImageUrlFromToken(token)
  return <UIKitTokenImage src={src} {...props} />
}
