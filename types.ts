
export enum UserRole {
  TECHNICIAN = 'TECHNICIAN',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export enum JobStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface ProofRequirement {
  id: string;
  type: 'PHOTO' | 'SIGNATURE' | 'GPS' | 'FORM';
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  value?: string; // image URL, base64 signature, or data
}

export interface Job {
  id: string;
  title: string;
  client: string;
  address: string;
  status: JobStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  progress: number;
  time: string;
  distance?: string;
  requirements: ProofRequirement[];
  technicianId?: string;
  feedback?: string;
  image?: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  approvalRate: string;
  onTimeRate: string;
  status: 'ACTIVE' | 'ON_SITE' | 'OFFLINE' | 'DELAYED';
  avatar: string;
}
