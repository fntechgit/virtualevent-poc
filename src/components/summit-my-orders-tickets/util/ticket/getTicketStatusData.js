import {
    STATUS_CANCELLED,
    STATUS_COMPLETE,
    STATUS_INCOMPLETE,
    STATUS_PAST,
    STATUS_UNASSIGNED,
} from "../../global/constants";

export const statusData = {
    [STATUS_UNASSIGNED]: {
        type: STATUS_UNASSIGNED,
        text: 'UNASSIGNED',
        icon: 'fa-exclamation-circle',
        className: 'unset',
    },
    [STATUS_INCOMPLETE]: {
        type: STATUS_INCOMPLETE,
        text: 'REQUIRED DETAILS NEEDED',
        icon: 'fa-exclamation-circle',
        className: 'warning',
    },
    [STATUS_COMPLETE]: {
        type: STATUS_COMPLETE,
        text: 'READY TO USE',
        icon: 'fa-check-circle',
        className: 'ticket-complete'
    },
    [STATUS_CANCELLED]: {
        type: STATUS_CANCELLED,
        text: 'CANCELLED',
        className: 'cancel',
    },
    [STATUS_PAST]: {
        type: STATUS_PAST,
        text: 'PAST',
        icon: 'fa-fw',
        className: 'past',
    }
};

export const statusToKeyMap = {
    'Incomplete': STATUS_INCOMPLETE,
    'Complete': STATUS_COMPLETE,
    'Cancelled': STATUS_CANCELLED
};

export const getTicketStatusKey = (ticket, isSummitPast) => {
    if (!ticket.is_active) return STATUS_CANCELLED;

    if (ticket.owner_id === 0) return STATUS_UNASSIGNED;

    if (isSummitPast) return STATUS_PAST;

    if (!ticket.owner.first_name || !ticket.owner.last_name) return STATUS_INCOMPLETE;

    if (ticket.owner && ticket.owner.status === 'Incomplete') return STATUS_INCOMPLETE;

    if (ticket.owner && ticket.owner.status === 'Complete') return STATUS_COMPLETE;

    return statusToKeyMap[ticket.status];
};

export const getTicketStatusData = (ticket, isSummitPast) => statusData[getTicketStatusKey(ticket, isSummitPast)];
