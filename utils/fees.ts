import { coins } from '@cosmjs/stargate'
import { getConfig } from 'config'

import { NETWORK } from './constants'

export const getExecuteFee = () => {
  const config = getConfig(NETWORK)
  return {
    amount: coins(1400000000000, config.feeToken),
    gas: '2000000',
  }
}
