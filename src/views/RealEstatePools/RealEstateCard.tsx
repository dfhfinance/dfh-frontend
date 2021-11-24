import React, { useState } from 'react'
import { AddIcon, Box, Button, Card, Flex, IconButton, MinusIcon, Slider, Text } from '@dfh-finance/uikit'
import styled from 'styled-components'
import CardHeading from 'views/Farms/components/FarmCard/CardHeading'
import { testnetTokens } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { IconButtonWrapper } from 'views/Farms/components/FarmCard/StakeAction'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { ExpandingWrapper } from 'views/Farms/components/FarmCard/FarmCard'

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

const RealEstateCard: React.FC = () => {
  const { t } = useTranslation()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const code = 1001
  const multiplier = 10
  const isConnected = true
  const isApproved = true
  const isHarvestButtonDisabled = !isConnected || !isApproved
  const interestInUSD = '1,746.502'
  const interestInVND = '39,610,665'
  const stakedInUSD = '100,000.000'
  const stakedInVND = '2,268,000,000'
  const totalLiquidityPercentage = 53

  return (
    <StyledCard>
      <Box p="24px">
        <CardHeading
          lpLabel={`MS: ${code}`}
          token={testnetTokens.dfh}
          quoteToken={testnetTokens.dfh}
          multiplier={`${multiplier}X`}
        />
        <Row field="Giá Đầu Vào:" value="300,000 USDT (≈ 6.8 tỉ VND)" />
        <Row field="Giá Đầu Ra:" value="330,000 USDT (≈ 7.5 tỉ VND)" />
        <Row field="Lợi nhuận kì vọng:" value="10%" />
        <Row field="Tổng Vốn Huy Động:" value="35,000 USDT (≈ 800 triệu VND)" />
        <Text color="secondary" textTransform="uppercase" bold mt="12px">
          Lợi nhuận của bạn
        </Text>
        <Flex justifyContent="space-between" alignItems="center" mb="12px">
          <Box>
            <Text fontSize="24px" bold>
              {interestInUSD} USDT
            </Text>
            <Text fontSize="14px">≈ {interestInVND} VND</Text>
          </Box>
          <Button variant="primary" disabled={isHarvestButtonDisabled}>
            {t('Harvest')}
          </Button>
        </Flex>
        {!isConnected ? (
          <ConnectWalletButton width="100%" />
        ) : !isApproved ? (
          <Button variant="primary" width="100%">
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
                  {stakedInUSD} USDT
                </Text>
                <Text fontSize="14px">≈ {stakedInVND} VND</Text>
              </Box>
              <IconButtonWrapper>
                <IconButton variant="tertiary" mr="6px">
                  <MinusIcon color="primary" width="14px" />
                </IconButton>
                <IconButton variant="tertiary">
                  <AddIcon color="primary" width="14px" />
                </IconButton>
              </IconButtonWrapper>
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
              1,234,567.890 USDT
            </Text>
            <Slider
              name="total-liquidity-percentage"
              min={0}
              max={100}
              value={totalLiquidityPercentage}
              valueLabel={`${totalLiquidityPercentage}%`}
              onValueChanged={() => null}
            />
          </>
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default RealEstateCard
