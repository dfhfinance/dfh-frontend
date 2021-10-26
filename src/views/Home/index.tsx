import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Button } from '@dfh-finance/uikit'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from '../../contexts/Localization'
import ConnectWalletButton from '../../components/ConnectWalletButton'

const HomePageContent = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100vh - 57px);
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    left: unset;
    right: 10vw;
    transform: none;
  }
`

const TypographySection = styled.div`
  order: 1;
  margin-top: 16px;
  color: #2d4067;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;

  > h1 {
    font-size: 24px;
    font-weight: 700;

    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 28px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 36px;
    }
  }

  > p {
    font-size: 18px;
    color: #2d4067;
    font-weight: 400;
    margin-top: 8px;
    max-width: 35ch;

    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 20px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 28px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    order: 0;
  }
`

const ButtonGrouping = styled.div`
  display: flex;
  justify-content: center;
  width: calc(100vw - 32px);
  margin-top: 8px;

  > * + * {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    margin-top: 32px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 32px;
  }
`

const StyledButton = styled(Button)`
  padding: 0;
  width: 130px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 160px;
  }
`

const StyledConnectWalletButton = styled(ConnectWalletButton)`
  padding: 0;
  width: 130px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 160px;
  }
`

const HomeAssetSection = styled.div`
  background-image: url('/images/background-home.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center top;
  width: 35vh;
  height: 55%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 45vh;
    height: 70%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 50vh;
    height: 100%;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 60vh;
  }
`

const Home: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation()

  return (
    <>
      <PageMeta />
      <HomePageContent>
        <TypographySection>
          <h1>{t('Stake to Earn.')}</h1>
          <p>{t('Trade, stake and earn cryptocurrency on the most popular decentralized platform.')}</p>
          <ButtonGrouping>
            <StyledConnectWalletButton variant="primary">{t('Connect Wallet')}</StyledConnectWalletButton>
            <StyledButton
              variant="secondary"
              style={{ color: '#2D4067', borderColor: '#2D4067' }}
              onClick={() => {
                history.push('/swap')
              }}
            >
              {t('Trade Now')}
            </StyledButton>
          </ButtonGrouping>
        </TypographySection>
        <HomeAssetSection />
      </HomePageContent>
    </>
  )
}

export default Home
