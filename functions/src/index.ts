import * as functions from 'firebase-functions';
import { google } from 'googleapis';

const serviceAccount = {
  client_email: 'sistema-agendamento-horarios@sistema-agendamento-barbearia.iam.gserviceaccount.com',
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCPXxo7Hx3C/Edw\nz6UV3d4lTAf1WR+w+UGneYr8+tbiSV9Vr0T2u0AYRDbdzOqW4V7CjHNt9aZjUzNF\nOZbtrugNXmKgfCoSGjeQfhbHhVHtRxkXUvxgJbQOpo6u9u73lLWIxQHjjIj5l1CG\nBDWtTC6Olueo/PYRBRGh10bHtVoe5vuv34C7NOl6MLH5Uu1snLaEnxRF2hDELn11\nGC+mM71qERGGHg8r/wb7GwkC6nr1RdVPMz5wGphWQPUxhNss+0MurxDcTxIDFL33\nn2oHaJSIPv8xgSaJGj0yEoEWGUk6KshD+dfw7/BheSuEGteyaIx2vN3IIqnFuUZ4\n6pwhjg6tAgMBAAECggEAIPXJp37bTjjGScKK3tCPYf6tM7PmC77534EbOVaHcSVS\nE/ZDwf9BWHLSNEKISeCM8ufsH4LiWiJF/qujLYhQ08X3oZJ574h0brT2Eq9tKsH2\nHD0ZRRdV4ipbUhD11hgrdcJo0UG9ObgWLIEqP+lsKJ67qkdhYH9MUusVXBMuoTy7\ntfov71XlG31le73A5H4OXnA3yO+gVgx0i7T3/otPgz4BI7qhh3OntY6OEYimeMgk\nKOwIWBbzY3jIyk/pNJO5fgZKsOsuez38mqv5F63t9J24p80zEGSo/8X6sVgc7fAh\nZ8hcaHT6HZIvt6FKJ5s0jsQhFwTzJEYIodOPjqfFRwKBgQDKfN2SjcEpdbL2Et57\nX0Lqr+JsHgr9hpXz7Tt1WjItboC5czEVcA1R/z15ChN0Mhl52XS9WmLycMjBl9o7\nQsdkXBwfvW/ifEdZDX7EvV/vpdWK5kkcL2US7Hu1c726f6UHovQ/o/cPL+Vmpo6c\nFeIjxQQgOLhci0TU8CwcSlWc3wKBgQC1Qsb40FEoG8K+qLIhWynZWQNWR7YtoAwV\n0SMaOKXVbxIXh0LCqfBPmfckBkjtgYROMEnuPl04cq5+MMrkE2hl37zJsnXzlRnf\n9GOUG72QyGuxSKoHc6qoZlCSIUlHWN0dt68L2nYFBw9MtK75raVsgl9CDl+0cDzq\n2szvfLO58wKBgA7dSbq3c0Wi4UdVLUXrQVNPJBUBw5bG6X0lnibIP0S8hvCWNzU2\nq5OoZA/doH34K4yZXQuFdhwMEYC8sAWHqnGAnYPq+SqsKuSrq/GvYTqLdviiXR2X\nkRjpiU9RtszZD/lWig2d8MYJoxJ9CZ0Fsjsj/GCNKWOJybzEAMj24AALAoGARWj0\n2IKtETbQNEJVNAC83cYASSHc2UvYVOJpFrlqh3io7OmW3wRESbcjtF/TvV9DUs2b\nAehPujXwK9JzXzMvXxN2L6ZvFH+cEO5801JsHO0ikBjLQ18/kozbfZnRfcjBo4eb\nOGbHmtVBPpZSCro8BnlGEP2AGJCCQ0zV/T87c5ECgYAUYGK7dI6bEm09U/QLM1Hf\nGBvWnYzAVE8BPbrctH0U9VJGKFImK/q1+i4+OMW7vCGttT4c1vuw1F3ikIlAX7iV\nD5qmFioDy59Mo5OakT3phT4WBqRHwExzDVrDtdm8gUxD62WQj4K2zw7XonGAwB64\nw4eNyAHy0zUeTgLHhZHFgQ==\n-----END PRIVATE KEY-----\n",
};

const auth = new google.auth.JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

export const createCalendarEvent = functions.https.onRequest(async (req, res) => {
  try {
    const event = req.body;
    const calendarId = 'primary';

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    res.status(200).send({ message: 'Evento criado com sucesso!', event: response.data });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).send({ error: 'Erro ao criar evento no Google Calendar' });
  }
});
