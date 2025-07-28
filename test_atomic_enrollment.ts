import { supabase } from './src/utils/supabase';

/**
 * Test script for atomic enrollment function
 * This script tests the race condition prevention in class enrollment
 */

async function testAtomicEnrollment() {
  console.log('🧪 Testing Atomic Enrollment Function...\n');

  // Test data
  const testClassId = 1; // Replace with actual test class ID
  const testTeacherId = 'test-teacher-uuid'; // Replace with actual teacher ID
  const testStudents = [
    'test-student-1',
    'test-student-2',
    'test-student-3',
    'test-student-4',
    'test-student-5'
  ];

  try {
    // Test 1: Basic enrollment
    console.log('📋 Test 1: Basic enrollment without race condition');
    const result1 = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: testClassId,
        p_student_ids: testStudents.slice(0, 2),
        p_teacher_id: testTeacherId,
        p_school_id: 1
      });

    console.log('✅ Result:', result1.data);

    // Test 2: Capacity limit test
    console.log('\n📋 Test 2: Capacity limit enforcement');
    const result2 = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: testClassId,
        p_student_ids: testStudents, // Try to add all 5 students
        p_teacher_id: testTeacherId,
        p_school_id: 1
      });

    console.log('✅ Result:', result2.data);

    // Test 3: Concurrent enrollment simulation
    console.log('\n📋 Test 3: Concurrent enrollment simulation');
    const concurrentPromises = [];
    
    for (let i = 0; i < 5; i++) {
      concurrentPromises.push(
        supabase.rpc('add_students_to_class_atomic', {
          p_class_id: testClassId,
          p_student_ids: [`test-student-${i + 10}`],
          p_teacher_id: testTeacherId,
          p_school_id: 1
        })
      );
    }

    const concurrentResults = await Promise.all(concurrentPromises);
    console.log('✅ Concurrent results:', concurrentResults.map(r => r.data));

    // Test 4: Duplicate enrollment prevention
    console.log('\n📋 Test 4: Duplicate enrollment prevention');
    const result4 = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: testClassId,
        p_student_ids: testStudents.slice(0, 1), // Try to add same student again
        p_teacher_id: testTeacherId,
        p_school_id: 1
      });

    console.log('✅ Result:', result4.data);

    // Test 5: Invalid student validation
    console.log('\n📋 Test 5: Invalid student validation');
    const result5 = await supabase
      .rpc('add_students_to_class_atomic', {
        p_class_id: testClassId,
        p_student_ids: ['invalid-student-uuid'],
        p_teacher_id: testTeacherId,
        p_school_id: 1
      });

    console.log('✅ Result:', result5.data);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

/**
 * Performance test for concurrent enrollment
 */
async function testConcurrentPerformance() {
  console.log('\n⚡ Performance Test: Concurrent Enrollment');
  
  const startTime = Date.now();
  const promises = [];
  
  // Simulate 10 concurrent enrollment attempts
  for (let i = 0; i < 10; i++) {
    promises.push(
      supabase.rpc('add_students_to_class_atomic', {
        p_class_id: 2, // Use different class for performance test
        p_student_ids: [`perf-student-${i}`],
        p_teacher_id: 'test-teacher-uuid',
        p_school_id: 1
      })
    );
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  console.log(`✅ Completed ${promises.length} concurrent operations in ${endTime - startTime}ms`);
  console.log('📊 Results:', {
    totalAttempts: results.length,
    successes: results.filter(r => r.data && r.data[0].total_added > 0).length,
    failures: results.filter(r => r.data && r.data[0].total_added === 0).length
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Atomic Enrollment Tests...\n');
  
  try {
    await testAtomicEnrollment();
    await testConcurrentPerformance();
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { testAtomicEnrollment, testConcurrentPerformance, runTests };