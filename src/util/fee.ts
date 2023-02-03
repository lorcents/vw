 export const pesaLinkCharges = (amount: number): number => {
  let fee: number=0;

  if (amount > 0 && amount < 100000) {
    fee = 20;
  } else if (amount >= 100000 && amount < 250000) {
    fee = 30;
  } else if (amount >= 250000 && amount < 500000) {
    fee = 50;
  } else if (amount >= 500000 && amount < 1000000) {
    fee = 100;
  }

  return fee;
};
