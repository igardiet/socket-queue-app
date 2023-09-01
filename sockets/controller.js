const TicketControl = require( '../models/ticketControl' );

const ticketControl = new TicketControl();

const socketController = socket =>
{
  socket.emit( 'last-ticket', ticketControl.last );
  socket.emit( 'current-state', ticketControl.last4 );
  socket.emit( 'pending-tickets', ticketControl.tickets.length );

  socket.on( 'next-ticket', ( payload, callback ) =>
  {
    const next = ticketControl.next();
    callback( next );
    socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );
  } );

  socket.on( 'attend-ticket', ( { desktop }, callback ) =>
  {
    if ( !desktop )
    {
      return callback(
        {
          ok: false,
          msg: 'Desktop is mandatory',
        } );
    }
    const ticket = ticketControl.attendTicket( desktop );

    socket.broadcast.emit( 'current-state', ticketControl.last4 );
    socket.emit( 'pending-tickets', ticketControl.tickets.length );
    socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

    if ( !ticket )
    {
      callback(
        {
          ok: false,
          msg: 'there are no more pending tickets',
        } );
    } else
    {
      callback(
        {
          ok: true,
          ticket,
        } );
    }
  } );
};

module.exports = { socketController };
