import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51Qoz8xDiPd9KqP2LsogY9pEGFUuA2CUWSFRbUETICokn9khYhISiifXrUMdgp13A6diYGJhQjOra6vYFSN54Nm8D00CtAK1Crj',
  );
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    if (session.status === 200) location.assign(session.data.session.url);
    // console.log(session.data.session.url);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }

  //1 get checkout session from api

  //2 create checkout form + change card
};
