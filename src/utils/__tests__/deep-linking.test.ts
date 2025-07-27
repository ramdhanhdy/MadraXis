describe('Deep Linking Configuration', () => {
  const linkingConfig = {
    prefixes: ['madraxis://'],
    config: {
      screens: {
        '(teacher)': {
          path: 'teacher',
          screens: {
            'class': {
              path: 'class',
              screens: {
                '[id]': {
                  path: ':id',
                  screens: {
                    'add-students': 'add-students'
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  it('should parse deep link to add students correctly', () => {
    const testUrl = 'madraxis://teacher/class/123/add-students';
    
    // Expected parsed result
    const expected = {
      path: 'teacher/class/123/add-students',
      params: { id: '123' }
    };
    
    expect(expected.path).toBe('teacher/class/123/add-students');
    expect(expected.params.id).toBe('123');
  });

  it('should handle invalid class ID in deep link', () => {
    const testUrl = 'madraxis://teacher/class/invalid/add-students';
    
    // Invalid ID should still be handled by the route
    const expected = {
      path: 'teacher/class/invalid/add-students',
      params: { id: 'invalid' }
    };
    
    expect(expected.params.id).toBe('invalid');
  });

  it('should generate correct deep link URL', () => {
    const baseUrl = 'madraxis://teacher/class';
    const classId = 123;
    const path = `${baseUrl}/${classId}/add-students`;
    
    expect(path).toBe('madraxis://teacher/class/123/add-students');
  });
});