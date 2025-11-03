import apper from "https://cdn.apper.io/actions/apper-actions.js";

apper.serve(async (req) => {
  try {
    // Parse request body
    const body = await req.text();
    let requestData;
    
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid JSON in request body"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate required fields
    if (!requestData.to || !requestData.message) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields: 'to' and 'message'"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = requestData.to.replace(/\s/g, "");
    
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid phone number format"
      }), {
        status: 422,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate message length
    if (requestData.message.length < 1 || requestData.message.length > 1600) {
      return new Response(JSON.stringify({
        success: false,
        error: "Message must be between 1 and 1600 characters"
      }), {
        status: 422,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get SMS service credentials
    let twilioAccountSid, twilioAuthToken, twilioPhoneNumber;
    
    try {
      twilioAccountSid = await apper.getSecret('TWILIO_ACCOUNT_SID');
      twilioAuthToken = await apper.getSecret('TWILIO_AUTH_TOKEN');
      twilioPhoneNumber = await apper.getSecret('TWILIO_PHONE_NUMBER');
    } catch (secretError) {
      return new Response(JSON.stringify({
        success: false,
        error: "SMS service not configured. Please contact administrator."
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      return new Response(JSON.stringify({
        success: false,
        error: "SMS service credentials not found"
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Prepare Twilio API request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    const authHeader = 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    
    const formData = new URLSearchParams({
      From: twilioPhoneNumber,
      To: cleanPhone,
      Body: requestData.message
    });

    // Send SMS via Twilio
    let twilioResponse;
    try {
      twilioResponse = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
    } catch (fetchError) {
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to connect to SMS service"
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: twilioData.message || "SMS sending failed",
        code: twilioData.code || twilioResponse.status
      }), {
        status: 422,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: "SMS sent successfully",
      messageId: twilioData.sid,
      status: twilioData.status,
      to: twilioData.to
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error occurred while processing SMS request"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});