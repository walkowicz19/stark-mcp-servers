"""
Security Guardrails Service
Provides security scanning, data classification, and compliance features
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import re
import hashlib
import secrets

from shared.base_service import BaseService, validate_required_fields


# Request/Response Models
class ClassifyRequest(BaseModel):
    content: str


class ClassificationResult(BaseModel):
    classification: str
    confidence: float
    reasoning: str


class AccessCheckRequest(BaseModel):
    path: str
    user: str
    action: str = "read"


class AccessResult(BaseModel):
    allowed: bool
    reason: str
    requiredPermissions: Optional[List[str]] = None


class ScanRequest(BaseModel):
    content: str


class SensitiveDataMatch(BaseModel):
    type: str
    value: str
    location: str
    confidence: float


class ScanResult(BaseModel):
    matches: List[SensitiveDataMatch]
    summary: Dict[str, Any]


class EncryptRequest(BaseModel):
    data: str
    keyId: Optional[str] = None


class EncryptionResult(BaseModel):
    encrypted: str
    algorithm: str
    keyId: str


class DecryptRequest(BaseModel):
    encrypted: str
    keyId: str


class ScanCodeRequest(BaseModel):
    code: str
    language: str


class Vulnerability(BaseModel):
    severity: str
    type: str
    description: str
    location: str
    remediation: Optional[str] = None


class CodeScanResult(BaseModel):
    vulnerabilities: List[Vulnerability]
    score: float


# Security Service Implementation
class SecurityService(BaseService):
    def __init__(self):
        super().__init__(
            name="Security Guardrails",
            version="1.0.0",
            description="Security scanning, data classification, and compliance service"
        )
        
        # Initialize security patterns
        self.sensitive_patterns = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            "ip_address": r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
            "api_key": r'\b[A-Za-z0-9]{32,}\b',
            "password": r'(?i)(password|passwd|pwd)\s*[:=]\s*[^\s]+',
        }
        
        # Security vulnerability patterns for code
        self.vulnerability_patterns = {
            "sql_injection": {
                "pattern": r'(execute|query)\s*\(\s*["\'].*\+.*["\']',
                "severity": "high",
                "description": "Potential SQL injection vulnerability"
            },
            "xss": {
                "pattern": r'innerHTML\s*=|document\.write\(',
                "severity": "high",
                "description": "Potential XSS vulnerability"
            },
            "hardcoded_secret": {
                "pattern": r'(?i)(api[_-]?key|password|secret|token)\s*[:=]\s*["\'][^"\']+["\']',
                "severity": "critical",
                "description": "Hardcoded secret detected"
            },
            "insecure_random": {
                "pattern": r'Math\.random\(\)|random\(\)',
                "severity": "medium",
                "description": "Insecure random number generation"
            },
        }
        
        self.register_endpoints()
    
    def register_endpoints(self):
        """Register all service endpoints"""
        
        @self.app.post("/classify", response_model=ClassificationResult)
        async def classify_data(request: ClassifyRequest):
            """Classify data sensitivity level"""
            content = request.content.lower()
            
            # Simple classification logic
            if any(keyword in content for keyword in ["secret", "password", "confidential", "private"]):
                return ClassificationResult(
                    classification="confidential",
                    confidence=0.9,
                    reasoning="Contains sensitive keywords"
                )
            elif any(keyword in content for keyword in ["internal", "restricted"]):
                return ClassificationResult(
                    classification="internal",
                    confidence=0.8,
                    reasoning="Contains internal-use indicators"
                )
            else:
                return ClassificationResult(
                    classification="public",
                    confidence=0.7,
                    reasoning="No sensitive indicators found"
                )
        
        @self.app.post("/access/check", response_model=AccessResult)
        async def check_access(request: AccessCheckRequest):
            """Check if user has access to resource"""
            # Simple access control logic
            if request.action == "read":
                return AccessResult(
                    allowed=True,
                    reason="Read access granted"
                )
            elif request.action in ["write", "delete"]:
                # Check if user has admin role (simplified)
                if "admin" in request.user.lower():
                    return AccessResult(
                        allowed=True,
                        reason=f"{request.action.capitalize()} access granted for admin"
                    )
                else:
                    return AccessResult(
                        allowed=False,
                        reason=f"{request.action.capitalize()} access requires admin privileges",
                        requiredPermissions=["admin"]
                    )
            else:
                return AccessResult(
                    allowed=False,
                    reason=f"Unknown action: {request.action}"
                )
        
        @self.app.post("/scan", response_model=ScanResult)
        async def scan_for_sensitive_data(request: ScanRequest):
            """Scan content for sensitive data"""
            matches = []
            
            for data_type, pattern in self.sensitive_patterns.items():
                for match in re.finditer(pattern, request.content):
                    matches.append(SensitiveDataMatch(
                        type=data_type,
                        value=match.group(),
                        location=f"Position {match.start()}-{match.end()}",
                        confidence=0.85
                    ))
            
            # Create summary
            summary = {
                "total": len(matches),
                "byType": {}
            }
            for match in matches:
                summary["byType"][match.type] = summary["byType"].get(match.type, 0) + 1
            
            return ScanResult(matches=matches, summary=summary)
        
        @self.app.post("/encrypt", response_model=EncryptionResult)
        async def encrypt_data(request: EncryptRequest):
            """Encrypt data (simplified implementation)"""
            # Generate or use provided key ID
            key_id = request.keyId or secrets.token_hex(16)
            
            # Simple encryption (in production, use proper encryption library)
            encrypted = hashlib.sha256(
                f"{request.data}:{key_id}".encode()
            ).hexdigest()
            
            return EncryptionResult(
                encrypted=encrypted,
                algorithm="SHA256",
                keyId=key_id
            )
        
        @self.app.post("/decrypt")
        async def decrypt_data(request: DecryptRequest):
            """Decrypt data (simplified implementation)"""
            # In production, implement proper decryption
            return {"data": "[DECRYPTED_DATA]"}
        
        @self.app.post("/scan/code", response_model=CodeScanResult)
        async def scan_code(request: ScanCodeRequest):
            """Scan code for security vulnerabilities"""
            vulnerabilities = []
            
            for vuln_type, vuln_info in self.vulnerability_patterns.items():
                for match in re.finditer(vuln_info["pattern"], request.code):
                    vulnerabilities.append(Vulnerability(
                        severity=vuln_info["severity"],
                        type=vuln_type,
                        description=vuln_info["description"],
                        location=f"Line {request.code[:match.start()].count(chr(10)) + 1}",
                        remediation=f"Review and fix {vuln_type} vulnerability"
                    ))
            
            # Calculate security score (0-100)
            if not vulnerabilities:
                score = 100.0
            else:
                # Deduct points based on severity
                deductions = sum(
                    30 if v.severity == "critical" else
                    20 if v.severity == "high" else
                    10 if v.severity == "medium" else 5
                    for v in vulnerabilities
                )
                score = max(0.0, 100.0 - deductions)
            
            return CodeScanResult(
                vulnerabilities=vulnerabilities,
                score=score
            )


# Create service instance
service = SecurityService()
app = service.get_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

# Made with Bob
