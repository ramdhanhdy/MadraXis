# Add Students to Classes - Testing Documentation

This directory contains comprehensive test suites for the "Add Students to Classes by Teachers" feature implementation.

## Test Structure

### Core Test Files

1. **classService.test.ts** - Unit tests for ClassService methods
   - Covers all business logic from tasks.md sections 13.1.1-13.1.10
   - Tests student addition, removal, and filtering
   - Validates permissions and error handling

2. **classService.security.test.ts** - Security-focused tests
   - SQL injection prevention
   - Input validation and sanitization
   - Permission-based access control
   - Cross-school enrollment prevention

3. **class/__tests__/enrollment.test.ts** - Enrollment service tests
   - Atomic enrollment operations
   - Class capacity validation
   - Duplicate enrollment prevention
   - Error handling for specific scenarios

4. **class/__tests__/access.test.ts** - Access control tests
   - Teacher-class association validation
   - School-based permission checks
   - Cross-school operation prevention

5. **integration.test.ts** - End-to-end integration tests
   - Complete workflow validation
   - Concurrent operation safety
   - Performance and scalability tests
   - Cross-service interaction tests

6. **testHelpers.ts** - Testing utilities and mock data
   - Mock data factories
   - Test utilities and helpers
   - Performance testing utilities

7. **runTests.ts** - Test runner and reporting
   - Automated test execution
   - Comprehensive reporting
   - Coverage analysis

## Running Tests

### Quick Start
```bash
# Run all tests with comprehensive reporting
bun run test:all

# Run individual test suites
bun run test:class-service
bun run test:security
bun run test:enrollment
bun run test:access
bun run test:integration

# Run with coverage
bun run test:ci

# View detailed test report
bun run test:report
```

### Development
```bash
# Run tests in watch mode
bun run test

# Run specific test file
bun test src/services/__tests__/classService.test.ts

# Run tests with debugging
bun test --verbose src/services/__tests__/integration.test.ts
```

## Test Coverage

### Requirements Coverage

#### ✅ Security Requirements
- **SQL Injection Prevention**: All database queries are tested against injection attacks
- **Input Validation**: All user inputs are validated and sanitized
- **Permission Checks**: Teacher permissions are validated for all operations
- **Cross-School Prevention**: School-based access control is enforced

#### ✅ Business Logic Requirements
- **Class Capacity**: Maximum student limits are enforced
- **Duplicate Prevention**: Students cannot be enrolled multiple times in same class
- **Teacher Validation**: Only class teachers can add students
- **School Consistency**: All operations respect school boundaries

#### ✅ Performance Requirements
- **Large Datasets**: Tests handle 1000+ students efficiently
- **Concurrent Operations**: Race conditions are prevented
- **Bulk Operations**: Batch enrollment is optimized
- **Pagination**: Large result sets are paginated

#### ✅ Error Handling Requirements
- **Network Failures**: Connection issues are handled gracefully
- **Database Errors**: Constraint violations are caught and reported
- **Permission Errors**: Access denied scenarios are handled
- **Invalid Input**: Malformed data is rejected with clear messages

### Test Categories

#### Unit Tests
- Individual method testing
- Mock external dependencies
- Fast execution
- Focused on specific functionality

#### Integration Tests
- End-to-end workflows
- Real database interactions (with mocks)
- Cross-service communication
- Complete user scenarios

#### Security Tests
- Penetration testing
- Input validation
- Access control
- Data protection

#### Performance Tests
- Load testing
- Stress testing
- Scalability testing
- Response time validation

## Test Data

### Mock Data Factories
- `createMockStudent()` - Generate realistic student data
- `createMockClass()` - Create test classes with various configurations
- `createMockTeacher()` - Generate teacher profiles
- `generateLargeStudentList()` - Create bulk test data

### Test Scenarios
- **Happy Path**: Successful student enrollment
- **Edge Cases**: Empty classes, full classes, duplicate attempts
- **Error Cases**: Network failures, permission issues, invalid data
- **Performance**: Large datasets, concurrent operations
- **Security**: Injection attacks, unauthorized access

## Debugging

### Common Issues

1. **Test Failures**
   - Check mock setup in testHelpers.ts
   - Verify Supabase mock responses
   - Ensure test isolation

2. **Coverage Issues**
   - Run `bun run test:ci` to generate coverage
   - Check uncovered lines in coverage reports
   - Add missing test cases

3. **Performance Issues**
   - Use testHelpers performance utilities
   - Check mock data generation efficiency
   - Verify query optimization

### Debugging Tips

```bash
# Run tests with verbose output
bun test --verbose src/services/__tests__/classService.test.ts

# Run specific test case
bun test -t "should prevent SQL injection in search queries"

# Debug with console.log
# Add console.log statements in testHelpers.ts for debugging

# Check test coverage
open coverage/lcov-report/index.html
```

## Adding New Tests

1. **Create Test File**: Add new test file in appropriate directory
2. **Use Mock Data**: Utilize testHelpers.ts for consistent mock data
3. **Follow Patterns**: Use existing test patterns and naming conventions
4. **Add to Runner**: Include new test file in runTests.ts
5. **Update Documentation**: Update this README with new test details

## Test Environment

### Dependencies
- **Jest**: Test framework
- **Bun**: Package manager and runtime
- **@testing-library/react-native**: React Native testing utilities
- **jest-expo**: Expo-specific Jest configuration

### Configuration
- **jest.config.js**: Jest configuration
- **jest.setup.js**: Test setup and global mocks
- **package.json**: Test scripts and dependencies

### Mock Setup
- **Supabase**: Mocked for all database operations
- **Network**: Mocked to prevent real API calls
- **Timers**: Mocked for consistent timing tests
- **Random**: Seeded for reproducible tests

## Reports

### Generated Reports
- **test-report.json**: Detailed test results
- **test-report.md**: Human-readable summary
- **coverage/**: Code coverage reports
- **junit.xml**: CI-compatible test results

### Report Location
All reports are generated in `src/services/__tests__/` directory.

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: bun run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "bun run test:class-service && bun run test:security"
    }
  }
}
```

## Support

For questions about testing implementation:
1. Check existing test files for examples
2. Review testHelpers.ts for available utilities
3. Run `bun run test:report` for comprehensive analysis
4. Consult the main documentation in docs/specs/in-progress/add-students-to-classes/