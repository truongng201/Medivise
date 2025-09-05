from minio import Minio
from minio.error import S3Error
import os
from datetime import timedelta

class MinioClient:
    def __init__(self):
        self.endpoint_internal = os.getenv('MINIO_INTERNAL', 'minio:9000')
        self.endpoint_external = os.getenv('MINIO_EXTERNAL', 'minio:9000')
        self.access_key = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
        self.secret_key = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
        self.secure_internal = os.getenv('MINIO_SECURE_INTERNAL', 'false').lower() in ['true', '1', 'yes']
        self.secure_external = os.getenv('MINIO_SECURE_EXTERNAL', 'false').lower() in ['true', '1', 'yes']

        self.bucket_name = os.getenv("MINIO_BUCKET_NAME", "test")

        self.client = Minio(
            self.endpoint_internal,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=self.secure_internal
        )
        
        self.presigned_client = Minio(
            self.endpoint_external,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=self.secure_external
        )