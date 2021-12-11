import {
  Box,
  Button,
  Card,
  CurrencyIcon,
  EarnIcon,
  Flex,
  Link,
  LoginIcon,
  LogoutIcon,
  Slider,
  Text,
  TrophyIcon,
  useModal,
  WaitIcon,
} from '@dfh-finance/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ethersToBigNumber } from 'utils/bigNumber'
import { formatBigNumber, formatNumber, getBalanceAmount } from 'utils/formatBalance'
import useApprovePool from 'views/ContributePools/hooks/useApprovePool'
import { PoolInfo, PoolStatus } from 'views/ContributePools/hooks/useContributedPoolInfos'
import useContributedToken from 'views/ContributePools/hooks/useContributedToken'
import usePendingProfit from 'views/ContributePools/hooks/usePendingProfit'
import useUserInfo from 'views/ContributePools/hooks/useUserInfo'
import useClaimProfit from 'views/ContributePools/hooks/useClaimProfit'
import useStakePool from 'views/ContributePools/hooks/useStakePool'
import ContributeModal from 'views/ContributePools/ContributeModal'
import useTokenBalance from 'hooks/useTokenBalance'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { TokenImage } from 'components/TokenImage'
import { Token } from '@dfh-finance/sdk'
import BigNumber from 'bignumber.js'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContributePoolContract } from 'hooks/useContract'
import { ethers } from 'ethers'

const StyledCard = styled(Card)`
  position: relative;
  width: 450px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 0 16px 0;

  > * {
    border-radius: 0; // Stupid UIKit's border-radius.
  }

  ${({ theme }) => theme.mediaQueries.sm} {
  }
`

const Row: React.FC<{ icon: React.ReactNode; field: string; value: string }> = ({ icon, field, value }) => {
  return (
    <Flex justifyContent="space-between">
      <Flex>
        {icon}
        <Text ellipsis ml="4px">
          {field}
        </Text>
      </Flex>
      <Text bold ellipsis textAlign="right" style={{ flex: '1' }}>
        {value}
      </Text>
    </Flex>
  )
}

export interface ContributedToken {
  address: string
  symbol: string
  decimals: number
}

const toDDHHMMSS = (milliseconds: number) => {
  let secs = Math.floor(milliseconds / 1000)

  const days = Math.floor(secs / 3600 / 24)
  secs -= days * 24 * 3600
  const hours = Math.floor(secs / 3600)
  secs -= hours * 3600
  const minutes = Math.floor(secs / 60)
  secs -= minutes * 60

  return [days, hours, minutes, secs].map((v) => (v < 10 ? `0${v}` : v)).join(':')
}

const PoolImage = styled(Box)<{ image: string }>`
  height: 150px;
  background-image: ${({ image }) => `url('${image}')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 200px;
  }
`

const PoolImageLayer = styled(Box)<{ show: boolean; text: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;

  ${({ show, text }) =>
    show &&
    `
  background: rgba(0, 0, 0, 0.5);
  &:before {
    content: '${text}';
    color: #ffffff;
    font-size: 22px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  `}

  ${({ theme }) => theme.mediaQueries.md} {
    height: 200px;
  }
`

const PoolTitle = styled(Flex)`
  isolation: isolate;
  justify-content: space-between;
  align-items: center;
  border-radius: 24px;
  padding: 10px 36px;
  margin-top: -30px;
  background: ${({ theme }) => theme.nav.background};
`

const PoolInformation = styled(Box)`
  padding: 8px 16px;
`

export default function ContributePoolCard({ poolInfo }: { poolInfo: PoolInfo }) {
  const { t } = useTranslation()
  const { account, chainId = +process.env.REACT_APP_CHAIN_ID } = useActiveWeb3React()
  const {
    id,
    ctbToken: ctbTokenAddress,
    withdrawFee,
    ctbMin,
    totalCtbMax,
    totalCtb, // Tổng token đã stake vào pool.
    tokenPerShare,
    withdrawnAmount,
    totalRefund,
    endCtbTime,
    dfhAmount,
    status,
    purchasePrice,
    expectedPrice,
    expectProfit,
    link,
    image,
  } = poolInfo
  const { isApprovedCtbToken, isApprovedDfh, onApprove, isApproving } = useApprovePool(id, dfhAmount, ctbTokenAddress)
  const onStake = useStakePool()
  const [isClaiming, onClaim] = useClaimProfit()
  const endCampaignTimestamp = endCtbTime.toNumber()
  const ctbToken = useContributedToken(ctbTokenAddress)
  const formattedExpectInput = `${formatNumber(purchasePrice, 0, 3)} VND`
  const formattedExpectOutput = `${formatNumber(expectedPrice, 0, 3)} VND`
  const expectProfitInPercentage = `${formatNumber((expectProfit * 100) / purchasePrice, 0, 6)}%`
  const formattedTotalStakeMax = ctbToken
    ? `${formatNumber(Number(formatBigNumber(totalCtbMax, ctbToken.decimals, ctbToken.decimals)), 0, 6)} ${
        ctbToken.symbol
      }`
    : 'Loading...'
  const formattedDFHAmount = `${formatNumber(Number(formatBigNumber(dfhAmount, 6, 18)), 0, 6)} DFH`
  const pendingProfit = usePendingProfit(id)
  const formattedPendingProfit =
    !account && ctbToken
      ? `0.0 ${ctbToken.symbol}`
      : ctbToken && pendingProfit
      ? `${formatNumber(Number(formatBigNumber(pendingProfit, ctbToken.decimals, ctbToken.decimals)), 0, 6)} ${
          ctbToken.symbol
        }`
      : 'Loading...'
  const userInfo = useUserInfo(id)
  const { amount: stakedAmount, receivedAmount, isStakingDfh } = userInfo[0] ?? {}
  const refetchUserInfo = userInfo[1]
  const formattedStakedAmount =
    ctbToken && stakedAmount
      ? `${formatNumber(Number(formatBigNumber(stakedAmount, ctbToken.decimals, ctbToken.decimals)), 0, 6)} ${
          ctbToken.symbol
        }`
      : 'Loading...'
  const formattedReceivedAmount =
    !account && ctbToken
      ? `0.0 ${ctbToken.symbol}`
      : ctbToken && receivedAmount
      ? `${formatNumber(Number(formatBigNumber(receivedAmount, ctbToken.decimals, ctbToken.decimals)), 0, 6)} ${
          ctbToken.symbol
        }`
      : 'Loading...'
  const formattedTotalStaked =
    ctbToken && totalCtb
      ? `${formatNumber(Number(formatBigNumber(totalCtb, ctbToken.decimals, ctbToken.decimals)), 0, 6)} ${
          ctbToken.symbol
        }`
      : 'Loading...'
  const totalStakedBigNumber = totalCtb && ethersToBigNumber(totalCtb)
  const totalStakeMaxBigNumber = totalCtbMax && ethersToBigNumber(totalCtbMax)
  const totalStakedInPercentage =
    totalStakedBigNumber && totalStakeMaxBigNumber
      ? totalStakedBigNumber.div(totalStakeMaxBigNumber).gt(1)
        ? 100
        : totalStakedBigNumber.div(totalStakeMaxBigNumber).times(100).toNumber()
      : 0
  const formattedTotalStakedInPercentage = `${formatNumber(totalStakedInPercentage, 0, 6)}%`
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const contributedTokenBalance = useTokenBalance(ctbTokenAddress).balance
  const dfhBalance = useTokenBalance(tokens.dfh.address).balance
  const isConnected = !!account
  const isClaimButtonDisabled =
    status === PoolStatus.CONTRIBUTING || !pendingProfit || pendingProfit.eq('0') || isClaiming
  const isStakeButtonDisabled =
    Date.now() > endCampaignTimestamp || status !== PoolStatus.CONTRIBUTING || totalCtb.gte(totalCtbMax)
  const [stakeTimeRemaining, setStakeTimeRemaining] = useState<number>(0)
  const formattedStakeTimeRemaining = toDDHHMMSS(stakeTimeRemaining)
  const isWindowVisible = useIsWindowVisible()
  const timer = useRef(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const contributePoolContract = useContributePoolContract()
  const [isStakingDFH, setIsStakingDFH] = useState(false)
  const onStakeDFH = useCallback(async () => {
    setIsStakingDFH(true)
    try {
      const tx = await callWithGasPrice(contributePoolContract, 'stakeDfh', [id])
      await tx.wait()
      setIsStakingDFH(false)
    } catch {
      setIsStakingDFH(false)
    }
  }, [callWithGasPrice, contributePoolContract, id])
  const isStakeDFHButtonDisabled =
    Date.now() > endCampaignTimestamp ||
    status !== PoolStatus.CONTRIBUTING ||
    totalCtb.gte(totalCtbMax) ||
    dfhBalance.lt(ethersToBigNumber(dfhAmount)) ||
    isStakingDFH

  useEffect(() => {
    if (isWindowVisible) {
      timer.current = setInterval(() => {
        if (status !== PoolStatus.CONTRIBUTING) {
          setStakeTimeRemaining(0)
          return
        }
        const now = Date.now()
        if (now < endCampaignTimestamp) {
          setStakeTimeRemaining(endCampaignTimestamp - now)
        } else if (stakeTimeRemaining !== 0) {
          setStakeTimeRemaining(0)
        }
      }, 1000)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [status, stakeTimeRemaining, setStakeTimeRemaining, endCampaignTimestamp, isWindowVisible])

  const [onPresentStakeModal] = useModal(
    <ContributeModal
      min={ctbToken ? ctbMin : ethers.BigNumber.from('0')}
      max={contributedTokenBalance}
      decimals={ctbToken?.decimals}
      symbol={ctbToken?.symbol}
      onConfirm={(amount) => onStake(id, amount, ctbToken, refetchUserInfo)}
    />,
  )

  const [fallbackImage, setFallbackImage] = useState<string>()

  const isTransferred = status === PoolStatus.CLOSED

  const now = Date.now()
  const isContributedSuccessfully =
    now > endCampaignTimestamp || status === PoolStatus.END_CONTRIBUTION || totalCtb.gte(totalCtbMax)

  return (
    <StyledCard>
      <Link target="_blank" href={link} style={{ display: 'block', width: '100%' }}>
        <img
          src={fallbackImage ?? image}
          style={{ width: '0', height: '0', display: 'block' }}
          onError={() => {
            setFallbackImage(
              'https://image.freepik.com/free-photo/empty-door-living-room-interior-background_1339-4844.jpg',
            )
          }}
          alt="hidden"
        />
        <PoolImage image={fallbackImage ?? image} />
        <PoolImageLayer
          show={isContributedSuccessfully || isTransferred}
          text={isTransferred ? t('Transferred') : t('Contributed successfully')}
        />
      </Link>
      <PoolTitle>
        <Text fontWeight={700}>{`MS: ${`00${id}`.slice(-3)}`}</Text>
        {ctbToken && (
          <TokenImage
            token={ctbToken ? new Token(chainId, ctbToken.address, ctbToken.decimals) : tokens.dfh}
            width={40}
            height={40}
          />
        )}
      </PoolTitle>
      <PoolInformation>
        <Text color="secondary" textTransform="uppercase" bold mb="4px">
          {t('Real Estate Information')}
        </Text>
        <Row icon={<LoginIcon />} field={t('Investment price')} value={formattedExpectInput} />
        {showExpandableSection && (
          <>
            <Row icon={<LogoutIcon />} field={t('Estimated selling price')} value={formattedExpectOutput} />
            <Row icon={<EarnIcon />} field={t('Expected profit')} value={expectProfitInPercentage} />
            <Row icon={<TrophyIcon />} field={t('Total mobilized capital')} value={formattedTotalStakeMax} />
            <Row icon={<CurrencyIcon />} field={t('Deposited DFH amount')} value={formattedDFHAmount} />
            <Row icon={<WaitIcon />} field={t('Remaining deposit time')} value={formattedStakeTimeRemaining} />
            <Text textAlign="center" fontSize="16px" mt="16px">
              {t("Pool's total assets")}
            </Text>
            <Text textAlign="center" fontSize="24px" bold>
              {formattedTotalStaked}
            </Text>
            <Slider
              name="total-liquidity-percentage"
              min={0}
              max={100}
              value={totalStakedInPercentage}
              valueLabel={formattedTotalStakedInPercentage}
              onValueChanged={() => null}
            />
          </>
        )}
        <Box m={showExpandableSection ? '0' : '12px'}>
          <ExpandableSectionButton
            onClick={() => setShowExpandableSection(!showExpandableSection)}
            expanded={showExpandableSection}
          />
        </Box>
        <Text color="secondary" textTransform="uppercase" bold mt="12px">
          {t('Your profit')}
        </Text>
        <Flex justifyContent="space-between" alignItems="center" mb="12px">
          <Box>
            <Text fontSize="24px" bold>
              {formattedPendingProfit}
            </Text>
            <Text fontSize="14px">
              {t('Claimed')}: {formattedReceivedAmount}
            </Text>
          </Box>
          <Button variant="primary" disabled={isClaimButtonDisabled} onClick={() => onClaim(id)}>
            {isClaiming ? t('Claiming profit...') : t('Claim profit')}
          </Button>
        </Flex>
        {!isConnected ? (
          <ConnectWalletButton width="100%" />
        ) : !isApprovedCtbToken || !isApprovedDfh ? (
          <Button variant="primary" width="100%" onClick={onApprove} disabled={isApproving}>
            {!isApprovedCtbToken && !isApprovedDfh
              ? isApproving
                ? t('Enabling Contract and DFH...')
                : t('Enable Contract and DFH')
              : !isApprovedCtbToken
              ? isApproving
                ? t('Enabling Contract...')
                : t('Enable Contract')
              : isApproving
              ? t('Enabling DFH...')
              : t('Enable DFH')}
          </Button>
        ) : (
          <>
            <Text color="secondary" textTransform="uppercase" bold mt="12px">
              {t('Your contribution')}
            </Text>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="24px" bold>
                {formattedStakedAmount}
              </Text>
              {isStakingDfh ? (
                <Button variant="primary" disabled={isStakeButtonDisabled} onClick={onPresentStakeModal}>
                  {t('Stake')}
                </Button>
              ) : (
                <Button variant="primary" disabled={isStakeDFHButtonDisabled} onClick={onStakeDFH}>
                  {dfhBalance.lt(ethersToBigNumber(dfhAmount))
                    ? `${t('Insufficient %symbol% balance', { symbol: 'DFH' })}`
                    : isStakingDFH
                    ? t('Staking DFH...')
                    : `${t('Stake')} DFH`}
                </Button>
              )}
            </Flex>
          </>
        )}
      </PoolInformation>
    </StyledCard>
  )
}
