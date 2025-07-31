<h1>Live Demo</h1>
A working version of this app is available at https://www.ascend-uat.tech

<h1>Getting Started (Local Development)</h1>
<p>1. Clone the project from https://github.com/tkuanhoong/ascend.git</p>
<p>2. Create the environment variables by completing the “.env.example” file.</p>
<p>3. Then, run the development server:</p>
<p>npm run dev</p>
<p>Open http://localhost:3000 with your browser to see the result.</p>

<p>4. Run the webhooks</p>
Ngrok webhook – To allow server to send request to determine if video is ready to be played.
Run "ngrok http --url=NGROK_WEBHOOK_URL"
NGROK_WEBHOOK_URL can be obtained from https://ngrok.com/
For example, "ngrok http --url=early-mutual-marmoset.ngrok-free.app 3000"
For documentation, visit https://ngrok.com/docs/integrations/mux/webhooks/
<br><br>
Stripe webhook – To allow server to send request to determine if payment has been made.
Run "stripe listen --forward-to STRIPE_WEBHOOK_URL "
STRIPE_WEBHOOK_URL can be any API from the project to receive the stripe webhook response.
For example, "stripe listen --forward-to localhost:3000/api/webhook/stripe"
For documentation, visit https://docs.stripe.com/stripe-cli/overview
