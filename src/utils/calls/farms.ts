import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract: Contract, pid, amount, account) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return masterChefContract.deposit(pid, value, account, options)
}

export const unstakeFarm = async (masterChefContract, pid, amount, account) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return masterChefContract.withdraw(pid, value, account, options)
}

export const harvestFarm = async (masterChefContract, pid, account) => {
  return masterChefContract.harvest(pid, account, options)
}
