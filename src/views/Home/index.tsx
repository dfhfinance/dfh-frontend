import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Button } from '@dfh-finance/uikit'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from '../../contexts/Localization'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

const HomePageContent = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100vh - 56px - 66px);
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: calc(100vh - 56px);
  }

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
  color: #d8c172;
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
    color: #d8c172;
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
    margin-top: 16px;
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
  animation: fadein 2.5s;

  @keyframes fadein {
    0% {
      margin-top: -2000px;
    }
    70% {
      margin-top: 0;
    }
    80% {
      margin-top: -50px;
    }
    100% {
      margin-top: 0;
    }
  }

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
  const { account } = useActiveWeb3React()

  return (
    <>
      <PageMeta />
      <HomePageContent>
        <TypographySection>
          <h1>{t('DFH Finance')}</h1>
          <p>{t('The digitization and sharing platform for investment in the real estate industry')}</p>
          <ButtonGrouping>
            {!account && <StyledConnectWalletButton variant="primary">{t('Connect Wallet')}</StyledConnectWalletButton>}
            <StyledButton
              variant="secondary"
              style={{ color: '#D8C172', borderColor: '#D8C172' }}
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
