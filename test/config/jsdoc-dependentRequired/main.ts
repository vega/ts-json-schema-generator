export interface Billing {
    name: string;

    /**
     * @dependentRequired billing_address
     */
    credit_card: string;
    /**
     * @dependentRequired credit_card
     * @dependentRequired name
     */
    billing_address: string;
}
