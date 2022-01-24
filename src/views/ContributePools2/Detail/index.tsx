import React, { useEffect, useState } from 'react'
import { Box, Flex } from '@dfh-finance/uikit'
import styled from 'styled-components'
import ContributePoolCard from 'views/ContributePools/ContributePoolCard'
import useContributePoolInfos, { PoolInfo, PoolStatus } from 'views/ContributePools/hooks/useContributedPoolInfos'
import TabButtons from 'views/ContributePools/TabButtons'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useMyPoolIds from 'views/ContributePools/hooks/useMyPoolIds'
import { Camera } from 'react-feather'
import TabImage from 'views/ContributePools2/Detail/components/TabImage'

const ContainerWrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  margin-top: 30px;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 50px;
`

const Background = styled.div`
  width: 100%;
`

const ImageBackground = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
`

const Main = styled.div`
  display: block;
  margin-top: 30px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const LeftPanel = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 50px;
    width: 450px;
  }
`

const RightPanel = styled.div`
  flex-grow: 1;
`

const SmallImage = styled.img`
  width: 180px;
  margin-right: 20px;
  height: 120px;
  border-radius: 10px;
`

const PrjInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 24px;
  h2 {
    color: #ffad2c;
    font-size: 36px;
  }
  div {
    line-height: 1.3;
  }
`

const OnBottom = styled.div`
  margin-top: auto;
`

const Card = styled.div`
  background: #1b1d1c;
  border-radius: 20px;
  margin-top: 30px;
`

const Timeline = styled(Card)`
  padding: 16px;
`

const TextColor = styled.div`
  color: #ffad2c;
  margin-bottom: 10px;
`

const TextTimeline = styled.div`
  color: #ffad2c;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`

const TimelineItem = styled(Flex)`
  margin-bottom: 24px;
`

const Round = styled.div`
  background: #ffad2c;
  color: #000;
  padding: 4px 18px;
  margin-right: 16px;
  border-radius: 20px;
`
const RoundDisabled = styled.div`
  background: gray;
  color: #000;
  padding: 4px 18px;
  margin-right: 16px;
  border-radius: 20px;
`

const CardPrice = styled(Card)`
  padding: 20px 16px;
  padding-bottom: 1px;
`
const TextCardPrice = styled.div`
  color: gray;
`
const CardPriceItem = styled(Flex)`
  justify-content: space-between;
  margin-bottom: 20px;
`

const CardContributeCont = styled(Card)`
  background: #0f0f0f;
  margin-top: 150px;
`

const CardContribute = styled(Card)`
  padding: 16px;
  padding-top: 40px;
`

const CardInfoOwnerCont = styled(Card)`
  background: #0f0f0f;
  margin-top: 30px;
`

const CardInfoOwner = styled(Card)`
  padding: 32px;
  padding-top: 20px;
`

const JustifyCenter = styled(Flex)`
  justify-content: center;
  color: #8e8e8e;
`

const JustifyEnd = styled(Flex)`
  justify-content: flex-end;
`

const PercentProgress = styled(JustifyEnd)`
  margin-right: 10px;
  color: #ffad2c;
  font-size: 14px;
  margin-bottom: 10px;
`

const TimeContribute = styled(Flex)`
  background: #0f0f0f;
  border-radius: 10px;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`

const TimeContributeItem = styled(Flex)`
  border-right: 1px solid #000;
  padding: 16px 20px;
  color: #ffad2c;
  &:last-child {
    border-right: none;
  }
`

const TotalContribute = styled.div`
  background: #0f0f0f;
  height: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
`

const ProgressContribute = styled.div`
  background: #ffad2c;
  height: 10px;
  border-radius: 10px;
  width: 90%;
`

const ContributeInfo = styled(Flex)`
  margin-top: 30px;
`

const ContributeInfoItem = styled.div`
  width: 33.33%;
  border-right: 1px solid gray;
  margin-left: 10px;
  &:last-child {
    border-right: none;
  }
`
const MyContribute = styled.div`
  padding: 24px;
`

const InputContributeDiv = styled.div`
  flex-grow: 1;
  position: relative;
`
const InputContributeBinanceIcon = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  left: 15px;
  top: 7px;
`

const InputContributeMax = styled.div`
  position: absolute;
  background: #ffad2c;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  right: 15px;
  bottom: 5px;
  cursor: pointer;
  z-index: 1;
`

const InputContribute = styled.input`
  color: #fff;
  border: 1px solid #292929;
  border-radius: 10px;
  background: #0f0f0f;
  height: 40px;
  width: 100%;
  padding-left: 50px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const ButtonContribute = styled.button`
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  background: #ffad2c;
  height: 40px;
  width: 150px;
  border: none;
  font-size: 18px;
`
const InfoOwner = styled.div`
  background: #705121;
  height: 30px;
  color: #ffad2c;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 10px;
`

const TextGray = styled.div`
  color: #8e8e8e;
`

const TextGrayContribute = styled(TextGray)`
  margin-bottom: 10px;
`

const FlexBetween = styled(Flex)`
  justify-content: space-between;
`

const ReviewCont = styled.div`
  padding: 16px 32px;
`

const ReviewContDetail = styled.div`
  padding: 16px;
`

const FormContribute = styled.form`
  display: flex;
  margin-top: 10px;
`

export default function ContributePool() {
  const { t } = useTranslation()

  return (
    <ContainerWrapper>
      <Background>
        <ImageBackground
          src="https://datxanhmienbac.com.vn/public/uploads/source/du-an-bds/Du%20an%20Vingroup/Vinhomes%20Ocean%20Park/Slide/d.jpg"
          alt="img"
        />
      </Background>
      <Main>
        <LeftPanel>
          <Flex>
            <SmallImage
              src="https://datxanhmienbac.com.vn/public/uploads/source/du-an-bds/Du%20an%20Vingroup/Vinhomes%20Ocean%20Park/Slide/d.jpg"
              alt="img"
            />
            <PrjInfo>
              <h2>Tên dự án</h2>
              <OnBottom>
                <div>Địa điểm</div>
                <div>Contract</div>
              </OnBottom>
            </PrjInfo>
          </Flex>
          <Timeline>
            <TextTimeline>Timeline</TextTimeline>
            <TimelineItem>
              <div>
                <Round>Vong 1</Round>
              </div>
              <div>
                <TextColor>Thời gian huy động vốn</TextColor>
                <p>00/00/00 - 00/00/00</p>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div>
                <Round>Vòng 2</Round>
              </div>
              <div>
                <TextColor>Thời gian đầu tư</TextColor>
                <p>00/00/00 - 00/00/00</p>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div>
                <RoundDisabled>Vòng 3</RoundDisabled>
              </div>
              <div>
                <TextColor>Kết thúc</TextColor>
              </div>
            </TimelineItem>
          </Timeline>
          <CardPrice>
            <CardPriceItem>
              <TextCardPrice>Giá đầu vào</TextCardPrice>
              <div>012,234,567</div>
            </CardPriceItem>
            <CardPriceItem>
              <TextCardPrice>Giá đầu ra</TextCardPrice>
              <div>012,234,567</div>
            </CardPriceItem>
            <CardPriceItem>
              <TextCardPrice>Lợi nhuận kỳ vọng</TextCardPrice>
              <div>012,234,567</div>
            </CardPriceItem>
          </CardPrice>
          <CardInfoOwnerCont>
            <CardInfoOwner>
              <TextTimeline>Thông tin chủ dự án</TextTimeline>
              <InfoOwner>VIETHOUSE</InfoOwner>
              <div>Địa chỉ</div>
            </CardInfoOwner>
            <ReviewCont>
              <FlexBetween>
                <TextGray>Số người đã đóng góp</TextGray>
                <div>0123456</div>
              </FlexBetween>
              <ReviewContDetail>
                <FlexBetween>
                  <TextColor>Rất tích cực</TextColor>
                  <div>0123456</div>
                </FlexBetween>
                <FlexBetween>
                  <TextColor>Tích cực</TextColor>
                  <div>0123456</div>
                </FlexBetween>
                <FlexBetween>
                  <TextColor>Tương đối</TextColor>
                  <div>0123456</div>
                </FlexBetween>
              </ReviewContDetail>
            </ReviewCont>
          </CardInfoOwnerCont>
        </LeftPanel>

        <RightPanel>
          <CardContributeCont>
            <CardContribute>
              <JustifyCenter>Bắt đầu đóng góp sau</JustifyCenter>
              <JustifyCenter>
                <TimeContribute>
                  <TimeContributeItem>0D</TimeContributeItem>
                  <TimeContributeItem>00h</TimeContributeItem>
                  <TimeContributeItem>00m</TimeContributeItem>
                  <TimeContributeItem>00s</TimeContributeItem>
                </TimeContribute>
              </JustifyCenter>
              <div>
                <JustifyCenter>Tổng số vốn đã đóng góp</JustifyCenter>
                <PercentProgress>90%</PercentProgress>
                <TotalContribute>
                  <ProgressContribute />
                </TotalContribute>
                <JustifyCenter>900.000/1.000.000 $DFH</JustifyCenter>
              </div>
              <ContributeInfo>
                <ContributeInfoItem>
                  <TextGrayContribute>Đóng góp tối thiểu</TextGrayContribute>
                  <div>100 USD</div>
                </ContributeInfoItem>
                <ContributeInfoItem>
                  <TextGrayContribute>Phân bổ (đặt hàng trước)</TextGrayContribute>
                  <div>100 USD</div>
                </ContributeInfoItem>
                <ContributeInfoItem>
                  <TextGrayContribute>Phân bổ (công khai)</TextGrayContribute>
                  <div>100 USD</div>
                </ContributeInfoItem>
              </ContributeInfo>
            </CardContribute>
            <MyContribute>
              <Flex>
                Đóng góp của tôi: &nbsp;
                <TextColor>20,000,000 USD</TextColor>
              </Flex>
              <FormContribute>
                <InputContributeDiv>
                  <InputContribute type="number" />
                  <InputContributeBinanceIcon src="/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.svg" />
                  <InputContributeMax>Max</InputContributeMax>
                </InputContributeDiv>
                <ButtonContribute>Xác nhận</ButtonContribute>
              </FormContribute>
            </MyContribute>
          </CardContributeCont>
          <TabImage />
        </RightPanel>
      </Main>
    </ContainerWrapper>
  )
}
