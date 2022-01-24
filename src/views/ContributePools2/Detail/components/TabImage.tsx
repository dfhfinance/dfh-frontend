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

const Card = styled.div`
  background: #1b1d1c;
  border-radius: 20px;
  margin-top: 30px;
`

const TabWrapper = styled.div`
  padding: 16px;
`

const TabCont = styled(Flex)`
  border-bottom: 1px solid gray;
  width: 100%;
`

const TabItem = styled.div<{ active: boolean }>`
  width: 50%;
  text-align: center;
  padding-bottom: 16px;
  cursor: pointer;
  ${({ active }) => active && 'border-bottom: 3px solid #ffad2c; color: #ffad2c;'}
`

const ImageCont = styled.div`
  height: 500px;
  overflow-y: scroll;
  padding: 16px;
`

export default function TabImage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('info')

  return (
    <Card>
      <TabWrapper>
        <TabCont>
          <TabItem active={tab === 'info'} onClick={() => setTab('info')}>
            Thông tin dự án
          </TabItem>
          <TabItem active={tab === 'law'} onClick={() => setTab('law')}>
            Pháp lý dự án
          </TabItem>
        </TabCont>
        <ImageCont>
          <img src="https://photo-cms-plo.zadn.vn/w800/Uploaded/2022/zgtrui/2019_09_23/so-hong_zsmt.jpg" alt="img" />
        </ImageCont>
      </TabWrapper>
    </Card>
  )
}
