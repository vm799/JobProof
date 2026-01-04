# GDPR Compliance Documentation

**Effective Date:** January 2026  
**Last Updated:** January 2026

## Overview

BoardingPass is committed to protecting the privacy and security of personal data in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.

## Data We Collect

### Personal Data
- **User Account Data:** Name, email address, password (encrypted)
- **Workspace Data:** Company name, logo, brand colors
- **Client Data:** Names, email addresses, onboarding responses, uploaded files
- **Usage Data:** Activity logs, analytics data, IP addresses

### Legal Basis for Processing
- **Contract Performance:** Processing necessary to provide onboarding services
- **Legitimate Interest:** Analytics, security, fraud prevention
- **Consent:** Marketing communications (opt-in required)

## Data Subject Rights

Users and their clients have the following rights under GDPR:

### 1. Right to Access
- Users can export all their data via Settings > Data Export
- API endpoint: `GET /api/v1/data-export`
- Response time: Immediate (automated)

### 2. Right to Rectification
- Users can update their information through the dashboard
- Contact support@getboardingpass.app for assistance

### 3. Right to Erasure ("Right to be Forgotten")
- Users can delete their account via Settings > Delete Account
- All associated data is permanently deleted within 30 days
- Backups are purged within 90 days

### 4. Right to Data Portability
- Data export available in JSON and CSV formats
- Includes all personal data, clients, flows, and analytics

### 5. Right to Object
- Users can object to data processing for marketing purposes
- Opt-out links provided in all marketing emails

### 6. Right to Restrict Processing
- Users can request temporary restriction of data processing
- Contact: privacy@getboardingpass.app

## Data Storage and Security

### Storage Locations
- **Primary Database:** Supabase (AWS US-East-1)
- **File Storage:** Supabase Storage (AWS US-East-1)
- **Backups:** Encrypted backups retained for 30 days

### Security Measures
- End-to-end encryption for data in transit (TLS 1.3)
- Encryption at rest (AES-256)
- Row-Level Security (RLS) policies
- Regular security audits and penetration testing
- SOC 2 Type II certification (In Progress - Q2 2026)

### Access Controls
- Multi-factor authentication (MFA) available
- Role-based access control (RBAC)
- Audit logging of all data access
- IP restrictions for admin accounts

## Data Retention

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| Active user accounts | Until account deletion | Permanent deletion |
| Deleted accounts | 30 days (grace period) | Permanent deletion |
| Audit logs | 7 years (compliance) | Secure deletion |
| Backups | 90 days | Secure deletion |
| Analytics data | 2 years | Anonymization |

## Data Processing Agreements (DPA)

BoardingPass provides a Data Processing Agreement to all customers upon request.

### Our Sub-processors
1. **Supabase** (Database & Storage) - GDPR compliant
2. **Vercel** (Hosting) - GDPR compliant
3. **Resend** (Email delivery) - GDPR compliant

## Data Breach Notification

In the event of a data breach:
1. We will notify affected users within 72 hours
2. We will notify relevant supervisory authorities
3. We will provide detailed information about the breach
4. We will outline remediation steps taken

Contact: security@getboardingpass.app

## International Data Transfers

BoardingPass processes data primarily in the United States. For transfers outside the EU:
- We use Standard Contractual Clauses (SCCs)
- Our sub-processors are GDPR compliant
- We comply with Privacy Shield principles

## Children's Privacy

BoardingPass does not knowingly collect data from individuals under 16 years of age.

## Changes to This Policy

We will notify users of material changes via email and dashboard notifications 30 days before changes take effect.

## Contact Information

**Data Protection Officer:**  
Email: dpo@getboardingpass.app  
Address: [Your Business Address]

**Support:**  
Email: support@getboardingpass.app  
Documentation: https://docs.getboardingpass.app/privacy

## Supervisory Authority

Users in the EU can lodge complaints with their local supervisory authority. Find your authority at: https://edpb.europa.eu/about-edpb/board/members_en
