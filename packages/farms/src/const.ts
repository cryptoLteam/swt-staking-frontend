import { FixedNumber } from '@ethersproject/bignumber'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

export const FIXED_ZERO = FixedNumber.from(0)
export const FIXED_ONE = FixedNumber.from(1)
export const FIXED_TWO = FixedNumber.from(2)

export const FIXED_TEN_IN_POWER_18 = FixedNumber.from(getFullDecimalMultiplier(18))

export const masterChefAddresses = {
  56: '0x6db5dd3BF025Db90A1049628559369062d777676',
  5: '0xa0C98A035a33954d604b79e2a4f5A13d448D456c',
  1: '0x96AdA1cd013b5A28548A5F8B8698f029A8DA30a2'
}

export const nonBSCVaultAddresses = {
  1: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  // 5: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
}
