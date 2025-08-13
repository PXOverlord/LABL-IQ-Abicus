# LABL IQ - Abicus Project Baseline

**Date:** January 2025  
**Project Guardian:** Senior Software Architect  
**Purpose:** Establish current state and development guidelines

---

## 🎯 Project Baseline Statement

This document establishes the current state of the LABL IQ - Abicus shipping analytics platform and provides guidelines for maintaining code quality, preserving functionality, and ensuring consistent development practices.

### Core Principles
1. **Preserve Critical Functionality:** Never remove or break working calculation engines, API endpoints, or business logic
2. **Maintain Architecture Integrity:** Keep the established frontend-backend separation and data flow patterns
3. **Ensure Code Quality:** Follow established patterns and maintain consistent coding standards
4. **Document Changes:** Track all modifications and their impact on the system

---

## 🏗️ Current Architecture Baseline

### Backend Architecture (FastAPI)

**Root Location:** `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/`

#### Core Structure
```
app/
├── main.py                 # FastAPI application entry point
├── core/                   # Configuration and core utilities
│   ├── config.py          # Application settings
│   ├── database.py        # Database connection management
│   └── security.py        # Authentication and authorization
├── api/                    # API route definitions
│   ├── analysis.py        # Analysis endpoints (CRITICAL)
│   ├── auth.py           # Authentication endpoints
│   ├── admin.py          # Admin functionality
│   ├── health.py         # Health checks
│   └── routes.py         # Legacy routes (backward compatibility)
├── services/              # Business logic services
│   ├── calc_engine.py    # Rate calculation engine (CRITICAL)
│   ├── processor.py      # File processing logic
│   ├── download.py       # Export functionality
│   └── reference_data/   # Rate tables and zone matrices
├── models/                # Database models
├── schemas/               # Pydantic schemas for validation
└── prisma/               # Database schema and migrations
```

#### Critical Components to Preserve

1. **Calculation Engine** (`services/calc_engine.py`)
   - **Purpose:** Core shipping rate calculations
   - **Critical Methods:**
     - `load_reference_data()`: Loads zone matrix and rate tables
     - `get_zone()`: Determines shipping zones (RECENTLY FIXED)
     - `calculate_shipment_rate()`: Main calculation method
     - `clean_zone_matrix()`: Fixes invalid zone values (NEW)
   - **Preservation Rules:**
     - Never remove zone calculation logic
     - Maintain all rate table references
     - Preserve error handling and validation
     - Keep all surcharge calculation methods

2. **File Processor** (`services/processor.py`)
   - **Purpose:** CSV/Excel file processing and data validation
   - **Critical Methods:**
     - `process_dataframe()`: Main processing pipeline
     - `suggest_column_mapping()`: Auto-detection of columns
     - `calculate_rates()`: Integration with calculation engine
   - **Preservation Rules:**
     - Maintain all data validation logic
     - Preserve column mapping functionality
     - Keep error handling for malformed data

3. **API Endpoints** (`api/analysis.py`)
   - **Purpose:** REST API for analysis operations
   - **Critical Endpoints:**
     - `POST /api/analysis/upload`: File upload
     - `POST /api/analysis/map-columns`: Column mapping
     - `POST /api/analysis/process`: Rate calculation
     - `GET /api/analysis/results/{id}`: Results retrieval
   - **Preservation Rules:**
     - Maintain all endpoint contracts
     - Preserve authentication requirements
     - Keep error response formats

### Frontend Architecture (Next.js)

**Root Location:** `existing_app/labl_iq_frontend/app/`

#### Core Structure
```
app/
├── app/                   # Next.js 13+ app router pages
│   ├── dashboard/        # Main dashboard page
│   ├── analysis/         # Analysis results pages
│   ├── settings/         # User settings
│   ├── history/          # Analysis history
│   └── api/             # API routes (if needed)
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components
│   └── ui/             # shadcn/ui components
├── lib/                 # Utilities and configurations
│   ├── stores/         # Zustand state management
│   ├── api.ts          # API client (CRITICAL)
│   └── utils.ts        # Utility functions
├── hooks/              # Custom React hooks
├── prisma/             # Database schema (if needed)
└── public/             # Static assets
```

#### Critical Components to Preserve

1. **State Management** (`lib/stores/`)
   - **analysis-store.ts:** Analysis workflow state
   - **auth-store.ts:** Authentication state
   - **profiles-store.ts:** Column mapping profiles
   - **Preservation Rules:**
     - Maintain all state interfaces
     - Preserve API integration patterns
     - Keep error handling logic

2. **API Client** (`lib/api.ts`)
   - **Purpose:** Backend communication layer
   - **Critical Methods:**
     - `analysisAPI.testProcess()`: File processing
     - `analysisAPI.upload()`: File upload
     - `authAPI.login()`: Authentication
   - **Preservation Rules:**
     - Maintain all API method signatures
     - Preserve error handling patterns
     - Keep demo mode functionality

3. **Core Components**
   - **FileUpload:** File selection and upload
   - **ColumnMapping:** Column mapping interface
   - **AnalysisResults:** Results visualization
   - **Preservation Rules:**
     - Maintain component interfaces
     - Preserve user interaction patterns
     - Keep styling and layout

### Database Architecture (PostgreSQL/Prisma)

**Location:** `existing_app/labl_iq_analysis/hybrid_backend/labl_iq_hybrid_backend/prisma/`

#### Schema Baseline
```prisma
// Core models - NEVER REMOVE OR BREAK
model User {
  id, email, password, role, isActive
  settings: UserSettings
  analyses: Analysis[]
  columnProfiles: ColumnProfile[]
}

model Analysis {
  id, userId, fileName, fileSize, status
  columnMapping, results, errorMessage
  createdAt, updatedAt, completedAt
}

model UserSettings {
  originZip, defaultMarkup, fuelSurcharge
  dasSurcharge, edasSurcharge, remoteSurcharge
  serviceLevelMarkups, dimDivisor
}
```

#### Preservation Rules
- Never remove core model relationships
- Maintain all required fields
- Preserve data integrity constraints
- Keep audit logging functionality

---

## 🔧 Development Guidelines

### Code Quality Standards

#### Backend (Python/FastAPI)
- **Type Hints:** Use comprehensive type hints throughout
- **Error Handling:** Implement proper exception handling with logging
- **Documentation:** Maintain docstrings for all public methods
- **Testing:** Write tests for critical business logic
- **Logging:** Use structured logging for debugging and monitoring

#### Frontend (TypeScript/Next.js)
- **Type Safety:** Maintain strict TypeScript configuration
- **Component Patterns:** Follow established component patterns
- **State Management:** Use Zustand stores for global state
- **Error Boundaries:** Implement proper error handling
- **Performance:** Optimize bundle size and loading times

### API Contract Preservation

#### Endpoint Stability
- **Never break existing endpoints** without proper deprecation
- **Maintain backward compatibility** for at least one version
- **Document all changes** in API documentation
- **Version endpoints** when making breaking changes

#### Data Contracts
- **Preserve all required fields** in request/response schemas
- **Maintain data types** and validation rules
- **Keep error response formats** consistent
- **Document schema changes** thoroughly

### Database Schema Evolution

#### Migration Guidelines
- **Never drop tables** without proper data migration
- **Add new fields** as nullable initially
- **Maintain foreign key relationships**
- **Test migrations** thoroughly before deployment
- **Backup data** before schema changes

#### Data Integrity
- **Preserve all constraints** and relationships
- **Maintain referential integrity**
- **Keep audit trails** for critical data
- **Validate data** at application and database levels

---

## 🚨 Critical Protection Zones

### 1. Calculation Engine Protection
**File:** `services/calc_engine.py`

**Protected Elements:**
- All zone calculation methods
- Rate table lookups
- Surcharge calculations
- Error handling logic
- Reference data loading

**Change Requirements:**
- Must pass all existing tests
- Must maintain calculation accuracy
- Must preserve error handling
- Must document all changes

### 2. API Endpoint Protection
**Files:** `api/analysis.py`, `api/auth.py`

**Protected Elements:**
- All endpoint signatures
- Authentication requirements
- Response formats
- Error handling patterns

**Change Requirements:**
- Must maintain backward compatibility
- Must preserve security measures
- Must update documentation
- Must test thoroughly

### 3. Frontend State Protection
**Files:** `lib/stores/`, `lib/api.ts`

**Protected Elements:**
- State management interfaces
- API client methods
- Error handling patterns
- User workflow logic

**Change Requirements:**
- Must maintain type safety
- Must preserve user experience
- Must handle errors gracefully
- Must test all workflows

---

## 📋 Change Management Process

### Before Making Changes

1. **Review Current State**
   - Understand the component's current functionality
   - Identify dependencies and integration points
   - Review recent changes and fixes

2. **Assess Impact**
   - Determine which components will be affected
   - Identify potential breaking changes
   - Plan backward compatibility strategy

3. **Document Intent**
   - Write clear description of proposed changes
   - Identify benefits and risks
   - Plan testing strategy

### During Implementation

1. **Follow Established Patterns**
   - Use existing code patterns and conventions
   - Maintain consistent naming and structure
   - Follow established error handling patterns

2. **Preserve Functionality**
   - Never remove working features without replacement
   - Maintain all critical business logic
   - Keep all user workflows functional

3. **Test Thoroughly**
   - Test all affected components
   - Verify integration points
   - Validate error handling

### After Implementation

1. **Document Changes**
   - Update relevant documentation
   - Record any breaking changes
   - Update API documentation if needed

2. **Validate Deployment**
   - Test in staging environment
   - Verify all functionality works
   - Monitor for any issues

3. **Update Baseline**
   - Update this document if architecture changes
   - Record new critical components
   - Update preservation guidelines

---

## 🔍 Monitoring and Validation

### Health Checks
- **Backend Health:** Monitor API endpoints and database connections
- **Frontend Health:** Check component rendering and state management
- **Integration Health:** Verify frontend-backend communication
- **Performance Health:** Monitor response times and resource usage

### Quality Gates
- **Code Quality:** Pass all linting and type checking
- **Test Coverage:** Maintain adequate test coverage
- **Performance:** Meet established performance benchmarks
- **Security:** Pass security scans and audits

### Validation Checklist
- [ ] All critical components functional
- [ ] API contracts maintained
- [ ] Database schema intact
- [ ] Frontend workflows working
- [ ] Error handling robust
- [ ] Performance acceptable
- [ ] Security measures active
- [ ] Documentation updated

---

## 📚 Reference Documentation

### Current Documentation
- **README.md:** Project overview and setup
- **AGENTS.md:** Agent integration guide
- **PROJECT_HEALTH_REPORT.md:** Current health status
- **INTEGRATION_GUIDE.md:** Backend integration details

### External Resources
- **GitHub Repository:** https://github.com/PXOverlord/LABL-IQ-Abicus
- **API Documentation:** http://localhost:8000/docs (when running)
- **Frontend Application:** http://localhost:3000

### Recent Fixes and Improvements
- **Zone Matrix Fixes:** See `zone_matrix_fixes_report.md`
- **CSV Upload Fixes:** See `CSV_Upload_Fix_Summary.md`
- **Project Analysis:** See `labl_iq_project_analysis.md`

---

## 🏁 Conclusion

This baseline document establishes the current state of the LABL IQ - Abicus project and provides comprehensive guidelines for maintaining code quality and preserving functionality during future development.

### Key Commitments
1. **Preserve Critical Functionality:** Never remove or break working features
2. **Maintain Architecture Integrity:** Keep established patterns and structures
3. **Ensure Code Quality:** Follow established standards and practices
4. **Document All Changes:** Track modifications and their impact

### Guardian Responsibilities
- **Review all changes** before implementation
- **Validate critical components** remain functional
- **Ensure architecture integrity** is maintained
- **Monitor project health** continuously

**This baseline serves as the foundation for all future development while ensuring the project's core value and functionality are preserved.**

---

**Baseline Established:** January 2025  
**Next Review:** After any major architectural changes  
**Guardian Status:** ✅ ACTIVE AND MONITORING 