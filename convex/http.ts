import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook, WebhookEvent } from "svix";

const validatePayload = async(req: Request): Promise<WebhookEvent | undefined>  => {
    const payload = await req.text();

    const svixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };
    const webHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    try {
        const event = webHook.verify(payload, svixHeaders) as WebhookEvent;
        return event;
    } catch (error) {
        console.error("Clerk webhook request could not be verified")
    }
    }


const handleClerkWebhook = httpAction(async (ctx,req)=>{
    const event = await validatePayload(req);

    if(!event){
        return new Response("Could not validate clerk payload", {status: 400});
    }
    
})

const http = httpRouter();

http.route({
    path : "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook
})

export default http;