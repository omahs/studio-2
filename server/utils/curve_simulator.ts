import BigNumber from "bignumber.js"

interface CurveOptions {
  ratio: number
  sellerFeeBps: number
  referralFeeBps: number
  protocolFeeBps: number
  totalSupply: number
}

export default function useCurveSimulator(options: CurveOptions) {
  function sumOfSquares(n: number): number {
    if (n === 0) {
      return 0;
    }

    return n * (n + 1) * (2 * n + 1) / 6;
  }

  function computeBasePrice(ratio: number, supply: number, amount: number): number {
    const sum1 = sumOfSquares(supply);
    const sum2 = sumOfSquares(supply + amount);

    return (sum2 - sum1) * 1_000_000 / ratio;
  }

  function fromNumberToBN(value: number): BigNumber {
    if (Number.isNaN(value)) {
      //throw new Error("Cannot convert NaN to BN");
      return new BigNumber(0);
    }

    return new BigNumber(value);
  }

  function fromBasisPoints(bps: number): number {
    return fromNumberToBN(bps).dividedBy(fromNumberToBN(100)).toNumber();
  }

  function fromMicroAmount(amount: number): number {
    return fromNumberToBN(amount)
      .integerValue(BigNumber.ROUND_DOWN)
      .dividedBy(fromNumberToBN(10).pow(6))
      .decimalPlaces(6)
      .toNumber();
  }

  function buyPrice() {
    const amount = 1
    const totalSupply = options.totalSupply

    const basePrice = computeBasePrice(options.ratio, totalSupply, amount)
    if (!basePrice || Number.isNaN(basePrice) || basePrice === Infinity) {
      throw new Error('Invalid base price')
    }

    const creatorFee = fromBasisPoints(options.sellerFeeBps) / 100 * basePrice
    if (!creatorFee || Number.isNaN(creatorFee) || creatorFee === Infinity) {
      throw new Error('Invalid creator fee')
    }

    const referralFee = 0 // TODO: fix it
    const protocolFee = fromBasisPoints(options.protocolFeeBps) / 100 * basePrice
    const totalPrice = basePrice + creatorFee + referralFee + protocolFee

    return {
      basePrice: fromMicroAmount(basePrice),
      creatorFee: fromMicroAmount(creatorFee),
      referralFee: fromMicroAmount(referralFee),
      protocolFee: fromMicroAmount(protocolFee),
      total: fromMicroAmount(totalPrice)
    }
  }

  return {
    buyPrice
  }
}