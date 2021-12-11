import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Flex, Modal, Text } from '@dfh-finance/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumber, getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import ethers from 'ethers'

interface StakeModalProps {
  min: ethers.BigNumber
  max: BigNumber
  decimals?: number
  symbol?: string
  addLiquidityUrl?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
}

const ContributeModal: React.FC<StakeModalProps> = ({ min, max, decimals, symbol = '', onConfirm, onDismiss }) => {
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const [val, setVal] = useState('')
  const valBn: BigNumber | undefined = val ? getDecimalAmount(new BigNumber(val), decimals) : undefined
  const [pendingTx, setPendingTx] = useState(false)

  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals)
  }, [max, decimals])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const formattedMin = formatBigNumber(min, decimals ?? 18)

  return (
    <Modal title={t('Stake')} onDismiss={onDismiss}>
      <ModalInput
        placeholder={formattedMin}
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={symbol}
        decimals={decimals}
        inputTitle={t('Stake')}
      />
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text mr="8px" color="textSubtle">
          {t('Min amount')}:
        </Text>
        <Text color="textSubtle">
          {formattedMin} {symbol}
        </Text>
      </Flex>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          disabled={pendingTx || !valBn || valBn.isLessThan(min.toString()) || valBn.isGreaterThan(max.toString())}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onConfirm(val)
              toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'))
              if (isMounted.current) {
                setPendingTx(false)
              }
              onDismiss()
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              console.error(e)
              if (isMounted.current) {
                setPendingTx(false)
              }
            }
          }}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default ContributeModal
