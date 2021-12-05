import { Box, Button, Card, Flex, Link, Slider, Text, useModal } from '@dfh-finance/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { testnetTokens } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ethersToBigNumber } from 'utils/bigNumber'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import useApprovePool from 'views/ContributePools/hooks/useApprovePool'
import { PoolInfo, PoolStatus } from 'views/ContributePools/hooks/useContributedPoolInfos'
import useContributedToken from 'views/ContributePools/hooks/useContributedToken'
import usePendingProfit from 'views/ContributePools/hooks/usePendingProfit'
import useUserInfo from 'views/ContributePools/hooks/useUserInfo'
import useClaimProfit from 'views/ContributePools/hooks/useClaimProfit'
import useStakePool from 'views/ContributePools/hooks/useStakePool'
import StakeModal from 'views/ContributePools/StakeModal'
import useTokenBalance from 'hooks/useTokenBalance'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { TokenImage } from 'components/TokenImage'
import { Token } from '@dfh-finance/sdk'

const StyledCard = styled(Card)`
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

const Row: React.FC<{ field: string; value: string }> = ({ field, value }) => {
  return (
    <Flex justifyContent="space-between">
      <Text ellipsis>{field}</Text>
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

const toHHMMSS = (milliseconds: number) => {
  const secs = Math.floor(milliseconds / 1000)
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor(secs / 60) % 60
  const seconds = secs % 60

  return [hours, minutes, seconds].map((v) => (v < 10 ? `0${v}` : v)).join(':')
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

const PoolTitle = styled(Flex)`
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

export default function ContributePoolCard({ id, poolInfo }: { id: number; poolInfo: PoolInfo }) {
  const { t } = useTranslation()
  const { account, chainId = +process.env.REACT_APP_CHAIN_ID } = useActiveWeb3React()
  const {
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
  const { isApprovedCtbToken, isApprovedDfh, onApprove } = useApprovePool(id, dfhAmount, ctbTokenAddress)
  const onStake = useStakePool()
  const onClaim = useClaimProfit()
  const endCampaignTimestamp = endCtbTime.toNumber()
  const ctbToken = useContributedToken(ctbTokenAddress)
  const formattedExpectInput = `${formatNumber(purchasePrice, 0, 3)} VND`
  const formattedExpectOutput = `${formatNumber(expectedPrice, 0, 3)} VND`
  const expectProfitInPercentage = `${formatNumber((expectProfit * 100) / purchasePrice, 0, 2)}%`
  const formattedTotalStakeMax = ctbToken
    ? `${formatBigNumber(totalCtbMax, ctbToken.decimals, ctbToken.decimals)} ${ctbToken.symbol}`
    : 'Loading...'
  const formattedDFHAmount = `${formatBigNumber(dfhAmount, 6, 18)} DFH`
  const pendingProfit = usePendingProfit(id)
  const formattedPendingProfit =
    !account && ctbToken
      ? `0.0 ${ctbToken.symbol}`
      : ctbToken && pendingProfit
      ? `${formatBigNumber(pendingProfit, ctbToken.decimals, ctbToken.decimals)} ${ctbToken.symbol}`
      : 'Loading...'
  const userInfo = useUserInfo(id)
  const { amount: stakedAmount, receivedAmount } = userInfo[0] ?? {}
  const refetchUserInfo = userInfo[1]
  const formattedStakedAmount =
    ctbToken && stakedAmount
      ? `${formatBigNumber(stakedAmount, ctbToken.decimals, ctbToken.decimals)} ${ctbToken.symbol}`
      : 'Loading...'
  const formattedReceivedAmount =
    !account && ctbToken
      ? `0.0 ${ctbToken.symbol}`
      : ctbToken && receivedAmount
      ? `${formatBigNumber(receivedAmount, ctbToken.decimals, ctbToken.decimals)} ${ctbToken.symbol}`
      : 'Loading...'
  const formattedTotalStaked =
    ctbToken && totalCtb
      ? `${formatBigNumber(totalCtb, ctbToken.decimals, ctbToken.decimals)} ${ctbToken.symbol}`
      : 'Loading...'
  const totalStakedBigNumber = totalCtb && ethersToBigNumber(totalCtb)
  const totalStakeMaxBigNumber = totalCtbMax && ethersToBigNumber(totalCtbMax)
  const totalStakedInPercentage =
    totalStakedBigNumber && totalStakeMaxBigNumber
      ? totalStakedBigNumber.div(totalStakeMaxBigNumber).gt(1)
        ? 100
        : totalStakedBigNumber.div(totalStakeMaxBigNumber).times(100).toNumber()
      : 0
  const formattedTotalStakedInPercentage = `${formatNumber(totalStakedInPercentage, 0, 2)}%`
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const isConnected = !!account
  const isClaimButtonDisabled =
    Date.now() < endCampaignTimestamp || status === PoolStatus.CONTRIBUTING || !pendingProfit || pendingProfit.eq('0')
  const isStakeButtonDisabled =
    Date.now() > endCampaignTimestamp || status !== PoolStatus.CONTRIBUTING || totalCtb.gte(totalCtbMax)

  const contributedTokenBalance = useTokenBalance(ctbTokenAddress).balance

  const [stakeTimeRemaining, setStakeTimeRemaining] = useState<number>(0)
  const formattedStakeTimeRemaining = toHHMMSS(stakeTimeRemaining)
  const isWindowVisible = useIsWindowVisible()
  const timer = useRef(null)

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
    <StakeModal
      min={ethersToBigNumber(ctbMin)}
      max={contributedTokenBalance}
      decimals={ctbToken?.decimals}
      symbol={ctbToken?.symbol}
      onConfirm={(amount) => onStake(id, amount, ctbToken, refetchUserInfo)}
    />,
  )

  return (
    <StyledCard>
      <Link target="_blank" href={link} style={{ display: 'block', width: '100%' }}>
        <PoolImage image={image} />
      </Link>
      <PoolTitle>
        <Text fontWeight={700}>{`MS: ${`00${id}`.slice(-3)}`}</Text>
        {ctbToken && (
          <TokenImage
            token={ctbToken ? new Token(chainId, ctbToken.address, ctbToken.decimals) : testnetTokens.dfh}
            width={40}
            height={40}
          />
        )}
      </PoolTitle>
      <PoolInformation>
        <Text color="secondary" textTransform="uppercase" bold mb="4px">
          {t('Real Estate Information')}
        </Text>
        <Row field={t('Investment price')} value={formattedExpectInput} />
        {showExpandableSection && (
          <>
            <Row field={t('Estimated selling price')} value={formattedExpectOutput} />
            <Row field={t('Expected profit')} value={expectProfitInPercentage} />
            <Row field={t('Total mobilized capital')} value={formattedTotalStakeMax} />
            <Row field={t('Deposited DFH amount')} value={formattedDFHAmount} />
            <Row field={t('Remaining deposit time')} value={formattedStakeTimeRemaining} />
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
            {t('Claim profit')}
          </Button>
        </Flex>
        {!isConnected ? (
          <ConnectWalletButton width="100%" />
        ) : !isApprovedCtbToken || !isApprovedDfh ? (
          <Button variant="primary" width="100%" onClick={onApprove}>
            {!isApprovedCtbToken && !isApprovedDfh
              ? t('Enable Contract and DFH')
              : !isApprovedCtbToken
              ? t('Enable Contract')
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
              <Button variant="primary" disabled={isStakeButtonDisabled} onClick={onPresentStakeModal}>
                {t('Stake')}
              </Button>
            </Flex>
          </>
        )}
      </PoolInformation>
    </StyledCard>
  )
}
