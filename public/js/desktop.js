const lblDesktop = document.querySelector( 'h1' );
const btnAttend = document.querySelector( 'button' );
const lblTicket = document.querySelector( 'small' );
const divAlert = document.querySelector( '.alert' );
const lblPending = document.querySelector( '#lblPending' );

const searchParams = new URLSearchParams( window.location.search );
if ( !searchParams.has( 'desktop' ) )
{
  window.location = 'index.html';
  throw new Error( 'Desktop is mandatory' );
}
const desktop = searchParams.get( 'desktop' );
lblDesktop.innerText = desktop;

divAlert.style.display = 'none';

const socket = io();

socket.on( 'connect', () =>
{
  btnAttend.disabled = false;
} );

socket.on( 'disconnect', () =>
{
  btnAttend.disabled = true;
} );

socket.on( 'pending-tickets', pending =>
{
  if ( pending == 0 )
  {
    lblPending.style.display = 'none';
  }
  else
  {
    lblPending.style.display = '';
    lblPending.innerText = pending;
  }
} );

btnAttend.addEventListener( 'click', () =>
{
  socket.emit( 'attend-ticket', { desktop }, ( { ok, ticket, msg } ) =>
  {
    if ( !ok )
    {
      lblTicket.innerText = 'No one';
      return ( divAlert.style.display = '' );
    }

    lblTicket.innerText = `Ticket ${ticket.number}`;
  } );
  //   socket.emit('next-ticket', null, ticket => {
  //     lblNewTicket.innerText = ticket;
  //   });
} );
