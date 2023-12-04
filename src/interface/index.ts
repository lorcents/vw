export type TransactionType = "debit" | "credit"; //debit-withdraw credit-deposit
type Service = "mps" | "jen";
/**
 * rtgs => send money to local kenya bank account using rtgs ||
 * swift => send money to global accounts using swift ||
 * kyc => know your customer ||
 * equity => send money to equity bank account ||
 * placc => send money to another bank account using pesa link bank ||
 * plmb => send money to mobile number using pesa link mobile
 */
export type ServiceId =
  | "express"
  | "rtgs"
  | "swift"
  | "kyc"
  | "equity"
  | "placc"
  | "plmb"
  | "mbwt";
// p3: { bankCode: "06", accNo: "12345", amt: "", fee: "" },

export interface TransactionBody {
  walletId: number; //wallet ID
  comment: string;
  transactionType: TransactionType; //transaction type: debit or credit
  service: Service;
  serviceId: ServiceId;
  serviceBody: any;
}
export interface mpsTransactionbody {
  amount: number;
  fee: number;
  comment: string;
  appId: string;
  phoneNumber: string;
  walletId: number;
}

export interface jenTransactionBody {
  amount: number;

  comment: string;
  appId: string;
  phoneNumber: string;
  walletId: number;
  accountNumber: string;
}

export interface wallet {
  phoneNumber: string;
  countryCode: string;
}


export interface user {
  firstName:string,
  secondName:string,
  phoneNumber:string,
  email:string
}
export interface externalWallet {
  fullName: string;
  bankName: string;
  bankcode: string;
  countryCode: string;
  accountNumber: string;
  walletId: number;
}

export interface currency {
  currencyName: string;
  currencySymbol: string;
  usdEquivalent: number;
  currencyCode: string;
  countryCode: string;
}

export interface log {
  transactionId: number;
  logObj: any;
  status: string;
}

export interface stkReqbody {
  phoneNumber: string;
  amount: number;
}
export interface statusUpdate {
  id: number;
  status: string;
}

export interface pendingTransaction {
  id: number;
  transactionType: TransactionType;
  amount: number;
  fee: number;
  comment: string;
  appId: string;
  con: Date;
  accNumber: string;
  status: string;
  walletId: number;
  service: Service;
}

export interface Transaction {
  transactionId: number;
  transactionType: TransactionType;

  walletId: number;
  amount: number;
  cost: number;
  comment: string;
  balance: number;
  accNumber: string;
  con: Date;
  valueTime: Date;
  service: Service;
}


export interface otpData {
  phoneNumber :string,
  otp :string
}