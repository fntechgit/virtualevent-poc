import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateOrderTotals } from '../../util';

export const OrderSummaryTable = ({ order, summit }) => {
    const { t } = useTranslation();
    const { discountTotal, refundTotal, taxesTotal, amountTotal, ticketSummary } = calculateOrderTotals({ order, summit });

    return (
        <div className="order-summary-table">
            <div className="row">
                <div className="col-xs-12">
                    <h4>{t("order_summary.order_summary")}</h4>
                </div>
            </div>

            {ticketSummary.length > 0 && (
                <>
                    {ticketSummary.map(ticket => {
                        let ticketTotal = ticket.qty * ticket.ticket_type.cost;

                        return (
                            <div className="row order-row" key={`tixorder_${ticket.ticket_type.created}`}>
                                <div className="col-xs-7">
                                    <span>{ticket.ticket_type.name}</span>
                                    <span>x{ticket.qty}</span>
                                </div>
                                <div className="col-xs-5 text-right subtotal">
                                    ${ticketTotal?.toFixed(2)}
                                </div>
                            </div>
                        )
                    })}
                </>
            )}

            {discountTotal > 0 && (
                <div className="row order-discounts order-row">
                    <div className="col-xs-7 text-left">
                        {t("order_summary.discounts")}
                    </div>
                    <div className="col-xs-5 text-right subtotal">
                        -${discountTotal}
                    </div>
                </div>
            )}

            {taxesTotal > 0 && (
                <div className="row order-taxes order-row">
                    <div className="col-xs-7 text-left">
                        {t("order_summary.taxes")}
                    </div>
                    <div className="col-xs-5 text-right subtotal">
                        ${taxesTotal}
                    </div>
                </div>
            )}

            {order.status === 'Paid' && (
                <div className="row order-amount-paid order-row amount-paid-row">
                    <div className="col-xs-7 text-left">
                        {t("order_summary.amount_paid")}
                    </div>
                    <div className="col-xs-5 text-right subtotal">
                        -${amountTotal}
                    </div>
                </div>
            )}

            {refundTotal > 0 && (
                <div className="row order-refunds order-row">
                    <div className="col-xs-7 text-left">
                        {t("order_summary.refunds")}
                    </div>
                    <div className="col-xs-5 text-right subtotal">
                        ${refundTotal}
                    </div>
                </div>
            )}

            <div className="row total-row">
                <div className="col-xs-6 text-left">
                    {t("order_summary.total")}
                </div>
                <div className="col-xs-6 text-right total">
                    ${order.status === 'Paid' ? '0.00' : amountTotal}
                </div>
            </div>
        </div>
    );
};