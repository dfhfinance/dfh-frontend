import styled from 'styled-components'

import React from 'react'
import { Flex } from '@dfh-finance/uikit'

const CardWrapper = styled(Flex)`
  margin: 0 auto;
  padding: 36px 16px;
  color: white;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 36px;
    grid-gap: 36px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 48px 64px;
    font-size: 20px;
  }
`

const Banner = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  width: 100%;
  padding: 8px 24px;
  grid-gap: 20px;
  background-image: url('/images/background-home.png');
  boder-radius: 5px;
`

const BannerImage = styled.div`
  background-image: url('/images/background-home.png');
  background-size: 100%;
  background-repeat: no-repeat;
  height: 350px;
`
const BannerContent = styled.div``

const ContentCenter = styled(Flex)`
  justify-content: center;
  align-items: center;
  line-height: 1.1;
`

const BannerStyle = styled(ContentCenter)`
  color: #ffad2c;
  font-size: 48px;
  text-transform: uppercase;
`

const BannerHeaderText = styled(BannerStyle)`
  font-weight: 700;
`

const BannerHeaderDescription = styled(BannerStyle)``

const BannerDescription = styled(ContentCenter)`
  font-size: 22px;
  padding: 30px 0 40px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`

const BannerCommunityContainer = styled.div`
  display: grid;
  margin: 0 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
  }
  grid-template-columns: 1fr;
`

const BannerCommunityItem = styled.div``

const BannerCommunityItemNumber = styled(ContentCenter)`
  font-weight: 550;
  font-size: 48px;
`

const BannerCommunityItemText = styled(ContentCenter)`
  margin: 10px 0 20px;
`

const TabSection = styled.div``

const UnderLineTab = styled.div``

const TabActive = styled.div``

const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`
const MainContentCardWrapper = styled.div``

export default function ContributePoolDashboard() {
  return (
    <CardWrapper>
      <Banner>
        <BannerImage />
        <BannerContent>
          <BannerHeaderText>DFH Finance</BannerHeaderText>
          <BannerHeaderDescription>Nền tảng góp vốn bất động sản</BannerHeaderDescription>
          <BannerDescription>
            Các bất động sản trên DFH Finance được lựa chọn và thẩm định rõ ràng bởi đội ngũ chuyên gia có kinh nghiệm
            lâu năm trong ngành Bất Động Sản
          </BannerDescription>
          <BannerCommunityContainer>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123</BannerCommunityItemNumber>
              <BannerCommunityItemText>Số lượng sản phẩm</BannerCommunityItemText>
            </BannerCommunityItem>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123.000</BannerCommunityItemNumber>
              <BannerCommunityItemText>Cộng đồng</BannerCommunityItemText>
            </BannerCommunityItem>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123%</BannerCommunityItemNumber>
              <BannerCommunityItemText>APY</BannerCommunityItemText>
            </BannerCommunityItem>
          </BannerCommunityContainer>
        </BannerContent>
      </Banner>
    </CardWrapper>
  )
}
