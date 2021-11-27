import { Box, Button, Card, Flex, Slider, Text } from '@dfh-finance/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { testnetTokens } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import { useToken } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ethersToBigNumber } from 'utils/bigNumber'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import useApprovePool from 'views/ContributePools/hooks/useApprovePool'
import { PoolInfo } from 'views/ContributePools/useContributedPoolInfos'
import useProfitUser from 'views/ContributePools/useProfitUser'
import useUserInfo from 'views/ContributePools/useUserInfo'
import CardHeading from 'views/Farms/components/FarmCard/CardHeading'
import { ExpandingWrapper } from 'views/Farms/components/FarmCard/FarmCard'
import useStakePool from './hooks/useStakePool'

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

export default function ContributePoolCard({ id, poolInfo }: { id: number; poolInfo: PoolInfo }) {
  const { isApproved, onApprove } = useApprovePool(poolInfo.contributedToken)
  const onStake = useStakePool()
  const { t } = useTranslation()
  const {
    expectInput,
    expectOutput,
    expectProfit,
    totalStakeMax,
    contributedToken: contributedTokenAddress,
    // Tổng token đã stake vào pool.
    totalStaked,
  } = poolInfo
  const contributedToken = useToken(contributedTokenAddress)
  const formattedExpectInput = `${formatNumber(expectInput, 0, 3)} VND`
  const formattedExpectOutput = `${formatNumber(expectOutput, 0, 3)} VND`
  const formattedExpectProfit = `${formatNumber(expectProfit, 0, 3)} VND`
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
  const multiplier = 10 // TODO:
  const { account } = useActiveWeb3React()
  const isConnected = !!account
  const isHarvestButtonDisabled = false // TODO:
  const isStakeButtonDisabled = false // TODO:

  return (
    <StyledCard>
      <Box p="24px">
        <CardHeading
          lpLabel={`MS: ${id}`}
          token={testnetTokens.dfh}
          quoteToken={testnetTokens.dfh}
          multiplier={`${multiplier}X`}
        />
        <Row field="Giá Đầu Vào:" value={formattedExpectInput} />
        <Row field="Giá Đầu Ra:" value={formattedExpectOutput} />
        <Row field="Lợi nhuận kì vọng:" value={formattedExpectProfit} />
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
          <Button variant="primary" disabled={isHarvestButtonDisabled}>
            {t('Harvest')}
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
              <Button
                variant="primary"
                disabled={isStakeButtonDisabled}
                onClick={() => onStake(id, '1', contributedToken)}
              >
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
