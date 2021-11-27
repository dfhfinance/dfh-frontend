import { useERC20 } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { ContributedToken } from 'views/ContributePools/ContributePoolCard'

export default function useContributedToken(address: string): ContributedToken | undefined {
  const contract = useERC20(address)
  const [token, setToken] = useState<ContributedToken>()

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()])
        setToken({
          address,
          symbol,
          decimals,
        })
      }
    }

    fetchData()
  }, [address, contract])

  return token
}
