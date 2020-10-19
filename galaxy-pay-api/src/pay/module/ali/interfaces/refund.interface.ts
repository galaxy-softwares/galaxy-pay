export interface AlipayRefundBizContent {
  trade_no: string;
  refund_amount: string;
  refund_currency?: string;
  refund_reason?: string;
  out_request_no?: string;
  operator_id?: string;
  terminal_id?: string;
  refund_royalty_parameters?: Array<RefundRoyaltyParameters>;
  org_pid?: string;
  query_options?: string;
}

export interface RefundRoyaltyParameters {
  royalty_type?: string;
  trans_out?: string;
  trans_out_type?: string;
  trans_in_type?: string;
  trans_in?: string;
  amount?: string;
  amount_percentage?: string;
  desc?: string;
}
