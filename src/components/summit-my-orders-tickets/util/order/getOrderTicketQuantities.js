export const getOrderTicketQuantities = (order, summit) =>
    order.tickets.reduce((acc, ticket) => {
        const ticketType = summit.ticket_types.find(q => q.id === ticket.ticket_type_id);
        const ticketTypeId = ticket.ticket_type_id;

        if (acc[ticketTypeId]) acc[ticketTypeId].quantity++;
        else acc[ticketTypeId] = { quantity: 1, name: ticketType.name, ...ticket };

        return acc;
    }, {});
