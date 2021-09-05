export interface CheckoutState {
  checkout_payload: string[];
}

const initialState = {
  checkout_payload: [],
};

export type Action = { type: "CHECKOUT"; payload: string };

export const CheckoutReducer = (state: CheckoutState = initialState, action: Action): CheckoutState => {
  switch (action.type) {
    case "CHECKOUT": {
      return { ...state, checkout_payload: [...state.checkout_payload, action.payload] };
    }
    default:
      return state;
  }
};
