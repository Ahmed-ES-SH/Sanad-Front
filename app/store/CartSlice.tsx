import { create } from "zustand";
import { CartItemType } from "../types/cart";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

export interface GuestCartItem {
  serviceId: string;
  quantity: number;
}

export interface FailedMergeItem {
  serviceId: string;
  reason: string;
}

export interface MergeCartResult {
  failedItems: FailedMergeItem[];
}

interface CartState {
  items: CartItemType[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
  add: (
    item: Omit<CartItemType, "quantity" | "subtotal"> & { quantity?: number },
  ) => void;
  delete: (target: { itemId?: string; serviceId?: string }) => void;
  clear: () => void;
  merge: (guestItems: CartItemType[]) => MergeCartResult;
}

const clampQuantity = (quantity: number): number => {
  if (!Number.isFinite(quantity)) {
    return MIN_QUANTITY;
  }
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(quantity)));
};

const recalculate = (
  items: CartItemType[],
): Pick<CartState, "totalItems" | "totalAmount"> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0,
  );

  return { totalItems, totalAmount };
};

const findByServiceId = (items: CartItemType[], serviceId: string): number =>
  items.findIndex((item) => item.serviceId === serviceId);

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,

  add: (item) => {
    const quantityToAdd = clampQuantity(item.quantity ?? MIN_QUANTITY);
    const currentItems = get().items;
    const existingIndex = findByServiceId(currentItems, item.serviceId);

    let nextItems: CartItemType[];
    if (existingIndex >= 0) {
      nextItems = [...currentItems];
      const existingItem = nextItems[existingIndex];
      const mergedQuantity = clampQuantity(
        existingItem.quantity + quantityToAdd,
      );

      nextItems[existingIndex] = {
        ...existingItem,
        ...item,
        quantity: mergedQuantity,
        subtotal:
          (item.unitPrice ?? existingItem.unitPrice ?? 0) * mergedQuantity,
      };
    } else {
      const unitPrice = item.unitPrice ?? 0;
      nextItems = [
        ...currentItems,
        {
          ...item,
          quantity: quantityToAdd,
          subtotal: unitPrice * quantityToAdd,
        },
      ];
    }

    set({
      items: nextItems,
      ...recalculate(nextItems),
      error: null,
    });
  },

  delete: ({ itemId, serviceId }) => {
    const nextItems = get().items.filter((item) => {
      if (itemId) {
        return item.id !== itemId;
      }
      if (serviceId) {
        return item.serviceId !== serviceId;
      }
      return true;
    });

    set({
      items: nextItems,
      ...recalculate(nextItems),
      error: null,
    });
  },

  clear: () => {
    set({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      error: null,
    });
  },

  merge: (guestItems) => {
    const failedItems: FailedMergeItem[] = [];
    const nextItems = [...get().items];

    for (const guestItem of guestItems) {
      const serviceId = guestItem?.serviceId?.trim();
      const rawQuantity = guestItem?.quantity;

      if (!serviceId) {
        failedItems.push({
          serviceId: guestItem?.serviceId ?? "",
          reason: "Missing serviceId",
        });
        continue;
      }

      if (!Number.isFinite(rawQuantity) || rawQuantity < MIN_QUANTITY) {
        failedItems.push({
          serviceId,
          reason: "Quantity must be at least 1",
        });
        continue;
      }

      const quantity = clampQuantity(rawQuantity);
      const existingIndex = findByServiceId(nextItems, serviceId);

      if (existingIndex >= 0) {
        const existingItem = nextItems[existingIndex];
        const mergedQuantity = clampQuantity(existingItem.quantity + quantity);
        nextItems[existingIndex] = {
          ...existingItem,
          quantity: mergedQuantity,
          subtotal: (existingItem.unitPrice ?? 0) * mergedQuantity,
        };
      }
    }

    set({
      items: nextItems,
      ...recalculate(nextItems),
      error: null,
    });

    return { failedItems };
  },
}));

export const selectCartItems = (state: CartState): CartItemType[] =>
  state.items;
export const selectCartCount = (state: CartState): number => state.totalItems;
export const selectCartTotalAmount = (state: CartState): number =>
  state.totalAmount;
export const selectCartIsEmpty = (state: CartState): boolean =>
  state.totalItems === 0;
