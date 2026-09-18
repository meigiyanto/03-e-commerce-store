import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CheckoutStep = 1 | 2 | 3;

export type ShippingAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

export type PaymentMethod =
  | "bank_transfer"
  | "e_wallet"
  | "cod";

export type LastOrder = {
  id: string;
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
};

type CheckoutStore = {
  step: CheckoutStep;

  couponCode: string;
  couponDiscount: number;
  shippingDiscount: number;
  couponMessage: string;

  shipping: ShippingAddress;

  paymentMethod: PaymentMethod;

  lastOrder: LastOrder | null;

  setStep: (step: CheckoutStep) => void;

  setCoupon: (
    code: string,
    discount: number,
    shippingDiscount: number,
    message: string
  ) => void;

  clearCoupon: () => void;

  setShipping: (
    shipping: ShippingAddress
  ) => void;

  setPaymentMethod: (
    method: PaymentMethod
  ) => void;

  setLastOrder: (
    order: LastOrder
  ) => void;

  resetCheckout: () => void;
};

const initialShipping: ShippingAddress = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
};

export const useCheckoutStore =
  create<CheckoutStore>()(
    persist(
      (set) => ({
        step: 1,

        couponCode: "",
        couponDiscount: 0,
        shippingDiscount: 0,
        couponMessage: "",

        shipping: initialShipping,

        paymentMethod: "bank_transfer",

        lastOrder: null,

        setStep: (step) =>
          set({
            step,
          }),

        setCoupon: (
          code,
          discount,
          shippingDiscount,
          message
        ) =>
          set({
            couponCode: code,
            couponDiscount: discount,
            shippingDiscount,
            couponMessage: message,
          }),

        clearCoupon: () =>
          set({
            couponCode: "",
            couponDiscount: 0,
            shippingDiscount: 0,
            couponMessage: "",
          }),

        setShipping: (shipping) =>
          set({
            shipping,
          }),

        setPaymentMethod: (paymentMethod) =>
          set({
            paymentMethod,
          }),

        setLastOrder: (lastOrder) =>
          set({
            lastOrder,
          }),

        resetCheckout: () =>
          set({
            step: 1,
            couponCode: "",
            couponDiscount: 0,
            shippingDiscount: 0,
            couponMessage: "",
            shipping: initialShipping,
            paymentMethod: "bank_transfer",
          }),
      }),
      {
        name: "nexashop-checkout",
      }
    )
  );