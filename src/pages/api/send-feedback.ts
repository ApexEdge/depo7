export async function POST({ request }) {
  const data = await request.json();
  const { rating, feedback } = data;

  const emailContent = `
    Nouveau feedback reçu !
    Note : ${rating}/5
    Commentaire : ${feedback || 'Aucun commentaire'}
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'j.ebongue@avocats-ebongue.ca',
        subject: 'Nouveau Feedback',
        text: emailContent,
      }),
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
