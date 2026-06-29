export const useIAP = () => ({
  connected: false,
  products: [],
  subscriptions: [],
  getSubscriptions: async () => [],
  currentPurchase: undefined,
  currentPurchaseError: undefined,
  purchaseHistory: [],
});

export const finishTransaction = async () => {};
export const initConnection = async () => false;
export const endConnection = async () => {};
export const getSubscriptions = async () => [];
export const requestSubscription = async () => {};

export type Purchase = any;
export type ProductSubscription = any;
