import React from 'react'
import styled from 'styled-components'
import { Flex } from '@dfh-finance/uikit'
import { useHistory } from 'react-router-dom'

const CardWrapper = styled.div`
  background: #33332d;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
`

const CardHero = styled.img`
  border-radius: 15px;
  width: 100%;
  height: 35vw;
  object-fit: cover;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 200px;
  }
`

const CardContent = styled.div``

const CardContentRowWrapper = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`

const CardContentTVLWrapper = styled.div`
  padding: 16px;
  background: #262a26;
`

const CardContentRowName = styled.div``

const CardContentRowValue = styled.div``

const HeadingTVL = styled.div``

const SliderDescription = styled.div`
  font-size: 14px;
  text-align: center;
`

const StaticSlider = styled.div<{ value: number }>`
  width: 100%;
  border-radius: 5px;
  background: #000000;
  height: 12px;
  margin: 16px 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: #ffaa42;
    border-radius: 5px;
    height: 12px;
    width: ${({ value }) => `${value}%`};
  }
`

function CardContentRow({ name, value }: any) {
  return (
    <Flex justifyContent="space-between">
      <CardContentRowName>{name}</CardContentRowName>
      <CardContentRowValue>{value}</CardContentRowValue>
    </Flex>
  )
}

export default function Card() {
  const history = useHistory()

  return (
    <CardWrapper onClick={() => history.push('/pools2/123')}>
      <CardHero
        src="https://datxanhmienbac.com.vn/public/uploads/source/du-an-bds/Du%20an%20Vingroup/Vinhomes%20Ocean%20Park/Slide/d.jpg"
        alt="img"
      />
      <CardContent>
        <CardContentRowWrapper>
          <CardContentRow name="Tên dự án" value="Hà Nội" />
          <CardContentRow name="Chủ dự án" value="VietHouse" />
          <CardContentRow name="Giá đầu tư" value="2,300,000,000 VND" />
          <CardContentRow name="Giá bán dự kiến" value="~3,000,000,000 VND" />
          <CardContentRow name="Lợi nhuận kỳ vọng" value="~30%" />
          <CardContentRow name="Tổng vốn huy động" value="100,000 BUSD" />
          <CardContentRow name="Thời gian đầu tư" value="2 năm" />
        </CardContentRowWrapper>
        <CardContentTVLWrapper>
          <HeadingTVL>Tổng số vốn đã đóng góp</HeadingTVL>
          <StaticSlider value={90} />
          <SliderDescription>90,000 / 100,000 BUSD</SliderDescription>
        </CardContentTVLWrapper>
      </CardContent>
    </CardWrapper>
  )
}
