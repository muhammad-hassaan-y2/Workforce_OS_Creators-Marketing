"""
AWS Secrets Manager & Systems Manager Parameter Store Integration
===================================================================
Production secrets management module: loads rotatable API keys and config ARNs.
"""
import os
import json
import boto3
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

class SecretsManagerService:
    def __init__(self):
        self.region = AWS_REGION
        self.client = None
        
        aws_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
        
        if aws_key and aws_secret:
            try:
                self.client = boto3.client(
                    "secretsmanager",
                    region_name=self.region,
                    aws_access_key_id=aws_key,
                    aws_secret_access_key=aws_secret
                )
            except Exception as e:
                print(f"[Secrets Manager Init Notice]: {e}")

    def get_secret(self, secret_name: str) -> Dict[str, Any]:
        """Fetch secret string from AWS Secrets Manager or fallback to env."""
        if self.client:
            try:
                response = self.client.get_secret_value(SecretId=secret_name)
                if "SecretString" in response:
                    return json.loads(response["SecretString"])
            except Exception as e:
                print(f"[Secrets Manager Fetch Notice - {secret_name}]: {e}")

        # Fallback to local environment variables
        return {
            "AWS_BEDROCK_GUARDRAIL_ID": os.getenv("AWS_BEDROCK_GUARDRAIL_ID", "gr-kaiso-brand-001"),
            "AWS_BEDROCK_KB_ID": os.getenv("AWS_BEDROCK_KB_ID", "kb-kaiso-brand-docs-001"),
            "HUBSPOT_API_KEY": os.getenv("HUBSPOT_API_KEY", "mock_hubspot_key"),
            "DOCUSIGN_ACCOUNT_ID": os.getenv("DOCUSIGN_ACCOUNT_ID", "mock_docusign_id"),
            "SLACK_BOT_TOKEN": os.getenv("SLACK_BOT_TOKEN", "mock_slack_token")
        }

secrets_service = SecretsManagerService()
