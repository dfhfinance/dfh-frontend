import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@dfh-finance/uikit'
import Card from 'views/ContributePools2/Dashboard/components/Card'

const Container = styled.div`
  margin: 36px auto;
  color: white;
  max-width: calc(100vw - 32px);

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 1200px;
  }
`

const Banner = styled.div`
  width: 100%;
  border-radius: 20px;
  background: #2a2828;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const BannerImage = styled.div`
  background-image: url('/images/background-home.png');
  background-size: 100%;
  background-repeat: no-repeat;
  height: 350px;
  width: 100%;
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: revert;
  }
`
const BannerContent = styled.div`
  padding: 16px;
`

const ContentCenter = styled(Flex)`
  justify-content: center;
  align-items: center;
  line-height: 1.1;
`

const BannerStyle = styled(ContentCenter)`
  color: #ffad2c;
  text-transform: uppercase;
`

const BannerHeaderText = styled(BannerStyle)`
  font-weight: 700;
  font-size: 32px;
`

const BannerHeaderDescription = styled(BannerStyle)`
  font-size: 16px;
  margin-top: 4px;
`

const BannerDescription = styled(ContentCenter)`
  font-size: 18px;
  padding: 30px 0 40px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`

const BannerCommunityContainer = styled.div`
  display: grid;
  margin: 0 30px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const BannerCommunityItem = styled.div``

const BannerCommunityItemNumber = styled(ContentCenter)`
  font-weight: 550;
  font-size: 48px;
`

const BannerCommunityItemText = styled(ContentCenter)`
  margin: 10px 0 20px;
  color: #938a8a;
`

const Tabs = styled(Flex)`
  margin: 16px 0;
`

const TabItem = styled.div<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  text-align: center;
  text-transform: uppercase;
  color: ${({ active }) => (active ? '#ffad2c' : 'grey')};
  cursor: pointer;

  ${({ active }) => active && 'border-bottom: 5px solid #f5a540;'};
`

const Cards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 64px;
  }
`

export default function ContributePoolsDashboard() {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <Container>
      <Banner>
        <BannerImage />
        <BannerContent>
          <BannerHeaderText>DFH Finance</BannerHeaderText>
          <BannerHeaderDescription>N???n t???ng g??p v???n b???t ?????ng s???n</BannerHeaderDescription>
          <BannerDescription>
            C??c b???t ?????ng s???n tr??n DFH Finance ???????c l???a ch???n v?? th???m ?????nh r?? r??ng b???i ?????i ng?? chuy??n gia c?? kinh nghi???m
            l??u n??m trong ng??nh B???t ?????ng S???n
          </BannerDescription>
          <BannerCommunityContainer>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123</BannerCommunityItemNumber>
              <BannerCommunityItemText>S??? l?????ng s???n ph???m</BannerCommunityItemText>
            </BannerCommunityItem>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123.000</BannerCommunityItemNumber>
              <BannerCommunityItemText>C???ng ?????ng</BannerCommunityItemText>
            </BannerCommunityItem>
            <BannerCommunityItem>
              <BannerCommunityItemNumber>123%</BannerCommunityItemNumber>
              <BannerCommunityItemText>APY</BannerCommunityItemText>
            </BannerCommunityItem>
          </BannerCommunityContainer>
        </BannerContent>
      </Banner>
      <Tabs>
        <TabItem active={tabIndex === 0} onClick={() => setTabIndex(0)}>
          D??? ??n ??ang ????ng g??p
        </TabItem>
        <TabItem active={tabIndex === 1} onClick={() => setTabIndex(1)}>
          D??? ??n ???? ho??n th??nh
        </TabItem>
      </Tabs>
      <Cards>
        <Card />
        <Card />
        <Card />
      </Cards>
    </Container>
  )
}
