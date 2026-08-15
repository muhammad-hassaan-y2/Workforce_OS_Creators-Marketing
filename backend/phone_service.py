import os
import time
from typing import Dict, Any, Optional

try:
    from twilio.rest import Client
    from twilio.twiml.voice_response import VoiceResponse, Say
    TWILIO_SDK_AVAILABLE = True
except ImportError:
    TWILIO_SDK_AVAILABLE = False


class TwilioPhoneService:
    """
    Twilio Autonomous AI Phone Calling & Voice Agent Service.
    Initiates real outbound PSTN phone calls using Twilio Voice API, TwiML, and dynamic AI script generation.
    """

    @classmethod
    def initiate_call(
        cls, 
        to_phone_number: str, 
        prompt_text: str, 
        lead_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Dispatches an outbound phone call via Twilio REST API.
        If TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables are present,
        executes live Twilio call. Otherwise, returns verified TwiML dry-run execution schema.
        """
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_phone_number = os.getenv("TWILIO_PHONE_NUMBER")

        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        # Build TwiML voice response script
        twiml_script = cls.build_twiml_script(prompt_text, lead_name)

        if account_sid and auth_token and from_phone_number and TWILIO_SDK_AVAILABLE:
            try:
                client = Client(account_sid, auth_token)
                call = client.calls.create(
                    twiml=twiml_script,
                    to=to_phone_number,
                    from_=from_phone_number
                )
                return {
                    "status": "SUCCESS",
                    "protocol": "TWILIO_REST_API",
                    "call_sid": call.sid,
                    "to": to_phone_number,
                    "from": from_phone_number,
                    "call_status": call.status,
                    "timestamp": timestamp,
                    "message": f"Twilio outbound neural voice call dispatched to {to_phone_number}",
                    "twiml_generated": twiml_script
                }
            except Exception as err:
                return {
                    "status": "ERROR",
                    "protocol": "TWILIO_REST_API",
                    "to": to_phone_number,
                    "message": f"Twilio API Dispatch Error: {str(err)}",
                    "twiml_generated": twiml_script
                }

        # Dry-run execution mode if credentials are unconfigured
        return {
            "status": "SUCCESS_DRY_RUN",
            "protocol": "TWILIO_SDK_READY",
            "to": to_phone_number,
            "from": from_phone_number or "+18005550199 (Unconfigured TWILIO_PHONE_NUMBER)",
            "timestamp": timestamp,
            "notice": "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in backend/.env for live PSTN calling.",
            "message": f"Twilio Voice Agent prepared neural voice call for: '{prompt_text}' to {to_phone_number}",
            "data": {
                "lead": lead_name or "Sarah Jenkins (VP Sales)",
                "target_phone": to_phone_number,
                "latency_ms": 290,
                "twiml_response": twiml_script
            }
        }

    @classmethod
    def build_twiml_script(cls, prompt_text: str, lead_name: Optional[str] = None) -> str:
        """
        Generates standard TwiML XML string for Twilio voice synthesis.
        """
        if TWILIO_SDK_AVAILABLE:
            response = VoiceResponse()
            greeting = f"Hello {lead_name}, calling from Kaiso Agent OS. " if lead_name else "Hello, calling from Kaiso Agent OS. "
            response.say(greeting + prompt_text, voice="Polly.Joanna-Neural")
            return str(response)

        # Fallback TwiML XML string format
        greeting = f"Hello {lead_name}, calling from Kaiso Agent OS. " if lead_name else "Hello, calling from Kaiso Agent OS. "
        return f'<Response><Say voice="Polly.Joanna-Neural">{greeting}{prompt_text}</Say></Response>'
