import os
import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

def test_s3():
    print("=== Testing AWS S3 Service Config ===")
    from s3_service import s3_service
    print(f"S3 Bucket Name: {s3_service.bucket}")
    print(f"AWS Region: {s3_service.region}")
    
    items = s3_service.list_objects()
    print(f"\n[SUCCESS] S3 Service configured for '{s3_service.bucket}'. Sample object listing:")
    for item in items:
        print(f" - {item['key']} ({item['size']}) -> {item['url']}")

if __name__ == "__main__":
    test_s3()
