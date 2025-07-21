# Financial Management Phase 1 - Design Document

## Overview
Phase 1 introduces essential financial management capabilities for the management role in MadraXis, focusing on fee management, payment tracking, and basic financial reporting. This phase establishes the foundation for comprehensive financial operations while maintaining simplicity for initial implementation.

## Design Philosophy
- **Progressive Enhancement**: Start with core functionality, expand based on user feedback
- **Mobile-First**: Optimize for mobile management workflows
- **Integration Ready**: Design APIs and data structures to support future expansion
- **Security First**: Implement proper authorization and audit trails from day one

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Management Role                          │
├─────────────────────────────────────────────────────────────┤
│  Financial Dashboard  │  Fee Management  │  Payment Tracking│
├─────────────────────────────────────────────────────────────┤
│                   Financial API Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Supabase Database  │  Payment Gateway  │  Auth Service   │
├─────────────────────────────────────────────────────────────┤
│              External Integrations (Future)                 │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Management-Centric Flows
1. **Fee Creation**: Management → Financial API → Supabase → Student Records
2. **Payment Processing**: Parent/Student → Payment Gateway → Financial API → Update Records
3. **Reports**: Management → Financial API → Database Queries → Dashboard Display

#### Parent/Student Interaction Flows (Indirect)
4. **Overdue Notifications**: Management → Notification Service → Parent/Student → Payment Action
5. **Payment Receipts**: Payment Processing → Email/SMS → Parent/Student → Confirmation
6. **Fee Visibility**: Parent/Student → Parent Portal → Student Dashboard → Fee Display

### User Story Mapping for Roles

#### Management Stories
```
As a financial officer, I want to:
- Create bulk fees for all Grade 10 students so I don't have to enter them individually
- See a dashboard of overdue payments so I can prioritize collection efforts
- Generate monthly collection reports for board meetings
- Send payment reminders to parents of overdue students
- Process offline cash payments from parents who visit the office
```

#### Parent Stories (Indirect Interactions)
```
As a parent, I want to:
- Receive an SMS alert when my child's tuition is due in 3 days
- Get an email notification when my payment is confirmed
- View my child's complete fee history through the parent portal
- See a clear breakdown of what each fee covers
- Receive gentle reminders before fees become overdue

As a student, I want to:
- See my outstanding fees on my dashboard
- View payment history for my records
- Receive in-app notifications about upcoming fee due dates
```

#### Notification Flow Example
```
Trigger: Fee becomes overdue (3 days past due_date)
↓
System: Generate notification record
↓
Management: Review and approve reminder batch
↓
Notification Service: Send SMS/Email to parents
↓
Parent: Receives "Your child's tuition fee of $500 is 3 days overdue"
↓
Parent: Makes payment via preferred method
↓
System: Updates payment status and sends confirmation
```

## Component Design

### 1. Financial Dashboard
**Purpose**: Central financial overview for management

**Key Components**:
- **Summary Cards**: Total outstanding, today's collections, monthly revenue
- **Charts**: Payment trends, fee collection rates
- **Alerts**: Overdue payments, pending approvals
- **Quick Actions**: Generate invoice, view reports

**Design Patterns**:
- Responsive grid layout for cards
- Interactive charts using Recharts/React Native Chart Kit
- Pull-to-refresh for real-time updates

### 2. Fee Management Interface
**Purpose**: Create and manage student fees

**Key Components**:
- **Fee Templates**: Reusable fee structures for different grades/services
- **Bulk Actions**: Apply fees to multiple students
- **Individual Overrides**: Custom fees for special cases
- **Validation**: Ensure fee amounts and due dates are valid

**Design Patterns**:
- Form wizard for complex fee creation
- Batch selection with search/filter
- Confirmation modals for destructive actions

### 3. Payment Tracking System
**Purpose**: Monitor payment status and handle exceptions

**Key Components**:
- **Payment List**: Tabular view with filters and sorting
- **Payment Details**: Individual transaction view
- **Status Management**: Manual override capabilities
- **Communication**: Send reminders to parents

**Design Patterns**:
- Infinite scroll for large datasets
- Advanced filtering (date range, status, student)
- Bulk actions for efficiency

## Database Design

### Core Tables

#### `fees`
```sql
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  fee_type VARCHAR(50) NOT NULL, -- 'tuition', 'transport', 'activities', etc.
  amount DECIMAL(10,2) NOT NULL,
  CHECK (amount > 0),
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'waived'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  fee_id UUID REFERENCES fees(id),
  amount DECIMAL(10,2) NOT NULL,
  CHECK (amount > 0),
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'cash'
  payment_date DATE NOT NULL,
  transaction_id VARCHAR(100), -- External payment reference
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_by UUID REFERENCES users(id)
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Unique index on transaction_id for reconciliation
CREATE UNIQUE INDEX idx_payments_transaction_id_unique ON payments(transaction_id) 
WHERE transaction_id IS NOT NULL;
```

#### `fee_templates`
```sql
CREATE TABLE fee_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  grade_level VARCHAR(20),
  fee_items JSONB, -- Array of {type, amount, description}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
- `fees(student_id, status)` for student fee queries
- `fees(due_date, status)` for overdue fee reports
- `payments(student_id, payment_date)` for payment history
- `payments(transaction_id)` for payment gateway lookups

## API Design

### RESTful Endpoints

#### Fee Management
```
GET    /api/fees/student/:studentId    - Get student fees
POST   /api/fees                       - Create new fee
PUT    /api/fees/:id                   - Update fee
DELETE /api/fees/:id                   - Delete fee (soft delete)
POST   /api/fees/bulk                  - Create fees for multiple students
```

#### Payment Processing
```
GET    /api/payments/student/:studentId - Get payment history
POST   /api/payments                   - Record payment
PUT    /api/payments/:id               - Update payment status
POST   /api/payments/reminder          - Send payment reminders
```

#### Financial Reports
```
GET    /api/reports/summary            - Dashboard summary
GET    /api/reports/collections        - Collection reports
GET    /api/reports/outstanding        - Outstanding fees report
```

### GraphQL Schema (Future Enhancement)
```graphql
type Fee {
  id: ID!
  student: Student!
  feeType: String!
  amount: Float!
  dueDate: Date!
  status: FeeStatus!
  description: String
  payments: [Payment!]!
}

type Payment {
  id: ID!
  student: Student!
  fee: Fee!
  amount: Float!
  paymentMethod: String!
  paymentDate: Date!
  status: PaymentStatus!
  transactionId: String
}
```

## Security Design

### Authorization Model
- **Management Role**: Full access to all financial features
- **Read-Only Management**: View-only access for junior staff
- **Audit Trail**: All financial changes logged with user attribution

### Data Protection
- **Encryption**: Sensitive financial data encrypted at rest
- **Access Control**: Row-level security in Supabase
- **Rate Limiting**: API endpoints protected against abuse

### Compliance
- **Audit Logging**: Track all CRUD operations on financial data
- **Data Retention**: 7-year retention policy for financial records
- **Privacy**: GDPR-compliant handling of financial information

## User Experience Design

### Management Workflows
1. **Daily Review**: Morning dashboard check for overdue payments
2. **Fee Creation**: Weekly batch processing of new term fees
3. **Payment Processing**: Real-time updates as payments come in
4. **Month-End**: Generate collection reports and reconcile accounts

### Mobile-Optimized Interactions
- **Swipe Actions**: Quick status updates for payments
- **Voice Notes**: Add context to payment records
- **Offline Capability**: Queue actions when network is unavailable
- **Push Notifications**: Alert management to critical financial events

## Scalability Considerations

### Performance Optimization
- **Database Partitioning**: Partition large payment tables by year
- **Caching**: Redis caching for frequently accessed reports
- **Indexing**: Strategic indexes for common query patterns

### Future Extensibility
- **Multi-Currency Support**: Schema designed to support international schools
- **Multi-Campus**: Campus-level financial segregation
- **API Versioning**: Clear versioning strategy for backward compatibility
- **Plugin Architecture**: Hooks for third-party integrations

## Error Handling

### User-Friendly Error Messages
- **Validation Errors**: Clear indication of what went wrong
- **Payment Failures**: Actionable guidance for resolution
- **Network Errors**: Graceful degradation with retry mechanisms

### Logging Strategy
- **Structured Logging**: JSON-formatted logs for easy analysis
- **Error Tracking**: Integration with Sentry for error monitoring
- **Performance Metrics**: Track API response times and database queries

## Testing Strategy

### Unit Tests
- **Business Logic**: Fee calculations, payment allocation
- **Validation Rules**: Input validation and error handling
- **API Endpoints**: Request/response validation

### Integration Tests
- **Payment Flow**: End-to-end payment processing
- **Database Operations**: CRUD operations with rollback capability
- **External Services**: Mock payment gateway responses

### User Acceptance Tests
- **Management Workflows**: Complete fee management scenarios
- **Mobile Experience**: Touch interactions and responsive design
- **Error Scenarios**: Graceful handling of edge cases