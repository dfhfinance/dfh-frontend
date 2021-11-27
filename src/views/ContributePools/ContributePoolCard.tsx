import { Box, Button, Card, Flex, Slider, Text, useModal } from '@dfh-finance/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { testnetTokens } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ethersToBigNumber } from 'utils/bigNumber'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import useApprovePool from 'views/ContributePools/hooks/useApprovePool'
import { PoolInfo } from 'views/ContributePools/hooks/useContributedPoolInfos'
import useContributedToken from 'views/ContributePools/hooks/useContributedToken'
import useProfitUser from 'views/ContributePools/hooks/useProfitUser'
import useUserInfo from 'views/ContributePools/hooks/useUserInfo'
import CardHeading from 'views/Farms/components/FarmCard/CardHeading'
import { ExpandingWrapper } from 'views/Farms/components/FarmCard/FarmCard'
import useClaimProfit from 'views/ContributePools/hooks/useClaimProfit'
import useStakePool from 'views/ContributePools/hooks/useStakePool'
import DepositModal from 'views/Farms/components/DepositModal'
import StakeModal from 'views/ContributePools/StakeModal'
import useTokenBalance from 'hooks/useTokenBalance'

const StyledCard = styled(Card)`
  width: 550px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

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

export default function ContributePoolCard({ id, poolInfo }: { id: number; poolInfo: PoolInfo }) {
  const { isApproved, onApprove } = useApprovePool(poolInfo.contributedToken)
  const onStake = useStakePool()
  const onClaim = useClaimProfit()
  const { t } = useTranslation()
  const {
    expectInput,
    expectOutput,
    expectProfit,
    totalStakeMax,
    contributedToken: contributedTokenAddress,
    // Tổng token đã stake vào pool.
    totalStaked,
    endCampaign,
    status,
    stakeMin,
  } = poolInfo
  const endCampaignTimestamp = endCampaign.toNumber()
  const contributedToken = useContributedToken(contributedTokenAddress)
  const formattedExpectInput = `${formatNumber(expectInput, 0, 3)} VND`
  const formattedExpectOutput = `${formatNumber(expectOutput, 0, 3)} VND`
  const expectProfitInPercentage = `${formatNumber((expectProfit * 100) / expectInput, 0, 2)}%`
  const formattedTotalStakeMax = contributedToken
    ? `${formatBigNumber(totalStakeMax, contributedToken.decimals, contributedToken.decimals)} ${
        contributedToken.symbol
      }`
    : 'Loading...'
  const profit = useProfitUser(id)
  const formattedProfit =
    contributedToken && profit
      ? `${formatBigNumber(profit, contributedToken.decimals, contributedToken.decimals)} ${contributedToken.symbol}`
      : 'Loading...'
  const { amount: stakedAmount } = useUserInfo(id) ?? {}
  const formattedStakedAmount =
    contributedToken && stakedAmount
      ? `${formatBigNumber(stakedAmount, contributedToken.decimals, contributedToken.decimals)} ${
          contributedToken.symbol
        }`
      : 'Loading...'
  const formattedTotalStaked =
    contributedToken && totalStaked
      ? `${formatBigNumber(totalStaked, contributedToken.decimals, contributedToken.decimals)} ${
          contributedToken.symbol
        }`
      : 'Loading...'
  const totalStakedBigNumber = totalStaked && ethersToBigNumber(totalStaked)
  const totalStakeMaxBigNumber = totalStakeMax && ethersToBigNumber(totalStakeMax)
  const totalStakedInPercentage =
    totalStakedBigNumber && totalStakeMaxBigNumber
      ? totalStakedBigNumber.div(totalStakeMaxBigNumber).gt(1)
        ? 100
        : totalStakedBigNumber.div(totalStakeMaxBigNumber).times(100).toNumber()
      : 0
  const formattedTotalStakedInPercentage = `${formatNumber(totalStakedInPercentage, 0, 2)}%`
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { account } = useActiveWeb3React()
  const isConnected = !!account
  // status: 0 in campaign.
  // status: 1 end campaign.
  // status: 2 close.
  const isClaimButtonDisabled = Date.now() < endCampaignTimestamp || status === 0
  const isStakeButtonDisabled = Date.now() > endCampaignTimestamp || status !== 0 || totalStaked.gte(totalStakeMax)

  const contributedTokenBalance = useTokenBalance(contributedTokenAddress).balance

  const [onPresentStakeModal] = useModal(
    <StakeModal
      min={ethersToBigNumber(stakeMin)}
      max={contributedTokenBalance}
      decimals={contributedToken?.decimals}
      symbol={contributedToken?.symbol}
      onConfirm={(amount) => onStake(id, amount, contributedToken)}
    />,
  )

  return (
    <StyledCard>
      <Box p="24px">
        <CardHeading lpLabel={`MS: ${id}`} token={testnetTokens.dfh} quoteToken={testnetTokens.dfh} isHideMultiplier />
        <Row field="Giá Đầu Vào:" value={formattedExpectInput} />
        <Row field="Giá Đầu Ra:" value={formattedExpectOutput} />
        <Row field="Lợi nhuận kì vọng:" value={expectProfitInPercentage} />
        <Row field="Tổng vốn huy động:" value={`${formattedTotalStakeMax}`} />
        <Text color="secondary" textTransform="uppercase" bold mt="12px">
          Lợi nhuận của bạn
        </Text>
        <Flex justifyContent="space-between" alignItems="center" mb="12px">
          <Box>
            <Text fontSize="24px" bold>
              {formattedProfit}
            </Text>
            <Text fontSize="14px">≈ 123,456.789 VND</Text>
          </Box>
          <Button variant="primary" disabled={isClaimButtonDisabled} onClick={() => onClaim(id)}>
            {t('Claim profit')}
          </Button>
        </Flex>
        {!isConnected ? (
          <ConnectWalletButton width="100%" />
        ) : !isApproved ? (
          <Button variant="primary" width="100%" onClick={onApprove}>
            {t('Enable Contract')}
          </Button>
        ) : (
          <>
            <Text color="secondary" textTransform="uppercase" bold mt="12px">
              Đóng góp của bạn
            </Text>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize="24px" bold>
                  {formattedStakedAmount}
                </Text>
                <Text fontSize="14px">≈ 123,456.789 VND</Text>
              </Box>
              <Button variant="primary" disabled={isStakeButtonDisabled} onClick={onPresentStakeModal}>
                {t('Stake')}
              </Button>
            </Flex>
          </>
        )}
      </Box>
      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <>
            <Text textAlign="center" fontSize="16px" mt="16px">
              Tổng tài sản của pool
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
      </ExpandingWrapper>
    </StyledCard>
  )
}
